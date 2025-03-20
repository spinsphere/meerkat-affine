import { DynamicModule, ExecutionContext } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { ClsModule } from 'nestjs-cls';

import { AppController } from './app.controller';
import {
  getRequestIdFromHost,
  getRequestIdFromRequest,
  ScannerModule,
} from './base';
import { CacheModule } from './base/cache';
import { ConfigModule } from './base/config';
import { ErrorModule } from './base/error';
import { EventModule } from './base/event';
import { GqlModule } from './base/graphql';
import { HelpersModule } from './base/helpers';
import { JobModule } from './base/job';
import { LoggerModule } from './base/logger';
import { MetricsModule } from './base/metrics';
import { MutexModule } from './base/mutex';
import { PrismaModule } from './base/prisma';
import { RedisModule } from './base/redis';
import { StorageProviderModule } from './base/storage';
import { RateLimiterModule } from './base/throttler';
import { WebSocketModule } from './base/websocket';
import { AuthModule } from './core/auth';
import { ServerConfigModule } from './core/config';
import { DocStorageModule } from './core/doc';
import { DocRendererModule } from './core/doc-renderer';
import { DocServiceModule } from './core/doc-service';
import { FeatureModule } from './core/features';
import { MailModule } from './core/mail';
import { NotificationModule } from './core/notification';
import { PermissionModule } from './core/permission';
import { QuotaModule } from './core/quota';
import { SelfhostModule } from './core/selfhost';
import { StorageModule } from './core/storage';
import { SyncModule } from './core/sync';
import { UserModule } from './core/user';
import { VersionModule } from './core/version';
import { WorkspaceModule } from './core/workspaces';
import { ModelsModule } from './models';
import { LicenseModule } from './plugins/license';

export const FunctionalityModules = [
  ClsModule.forRoot({
    global: true,
    // for http / graphql request
    middleware: {
      mount: true,
      generateId: true,
      idGenerator(req: Request) {
        // make every request has a unique id to tracing
        return getRequestIdFromRequest(req, 'http');
      },
      setup(cls, _req, res: Response) {
        res.setHeader('X-Request-Id', cls.getId());
      },
    },
    // for websocket connection
    // https://papooch.github.io/nestjs-cls/considerations/compatibility#websockets
    interceptor: {
      mount: true,
      generateId: true,
      idGenerator(context: ExecutionContext) {
        // make every request has a unique id to tracing
        return getRequestIdFromHost(context);
      },
    },
    plugins: [
      // https://papooch.github.io/nestjs-cls/plugins/available-plugins/transactional/prisma-adapter
      new ClsPluginTransactional({
        adapter: new TransactionalAdapterPrisma({
          prismaInjectionToken: PrismaClient,
        }),
      }),
    ],
  }),
  ConfigModule.forRoot(),
  ScannerModule,
  EventModule,
  RedisModule,
  CacheModule,
  MutexModule,
  PrismaModule,
  MetricsModule,
  RateLimiterModule,
  StorageProviderModule,
  HelpersModule,
  ErrorModule,
  LoggerModule,
  WebSocketModule,
  JobModule.forRoot(),
];

export class AppModuleBuilder {
  private readonly modules: AFFiNEModule[] = [];

  use(...modules: AFFiNEModule[]): this {
    modules.forEach(m => {
      this.modules.push(m);
    });

    return this;
  }

  useIf(predicator: () => boolean, ...modules: AFFiNEModule[]): this {
    if (predicator()) {
      this.use(...modules);
    }

    return this;
  }

  compile(): DynamicModule {
    class AppModule {}

    return {
      module: AppModule,
      imports: this.modules,
      controllers: [AppController],
    };
  }
}

export function buildAppModule() {
  const factor = new AppModuleBuilder();

  factor
    // basic
    .use(...FunctionalityModules)
    .use(ModelsModule)

    // enable schedule module on graphql server and doc service
    .useIf(
      () => env.flavors.graphql || env.flavors.doc,
      ScheduleModule.forRoot()
    )

    // auth
    .use(UserModule, AuthModule, PermissionModule)

    // business modules
    .use(
      FeatureModule,
      QuotaModule,
      DocStorageModule,
      NotificationModule,
      MailModule
    )
    // renderer server only
    .useIf(() => env.flavors.renderer, DocRendererModule)
    // sync server only
    .useIf(() => env.flavors.sync, SyncModule)
    // graphql server only
    .useIf(
      () => env.flavors.graphql,
      VersionModule,
      GqlModule,
      StorageModule,
      ServerConfigModule,
      WorkspaceModule,
      LicenseModule
    )
    // doc service only
    .useIf(() => env.flavors.doc, DocServiceModule)
    // self hosted server only
    .useIf(() => env.selfhosted, SelfhostModule);

  return factor.compile();
}

export const AppModule = buildAppModule();
