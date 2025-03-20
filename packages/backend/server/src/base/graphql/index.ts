import './config';

import type { ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloDriver } from '@nestjs/apollo';
import { Global, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { Config } from '../config';
import { mapAnyError } from '../nestjs/exception';
import { GQLLoggerPlugin } from './logger-plugin';

@Global()
@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (config: Config) => {
        return {
          ...config.graphql.apolloDriverConfig,
          path: '/graphql',
          csrfPrevention: {
            requestHeaders: ['content-type'],
          },
          plugins: [new GQLLoggerPlugin()],
          formatError: (formattedError, error) => {
            let ufe = mapAnyError(error);

            // @ts-expect-error allow assign
            formattedError.extensions = ufe.toJSON();
            if (env.canary) {
              formattedError.extensions.stacktrace = ufe.stacktrace;
            }
            return formattedError;
          },
        };
      },
      inject: [Config],
    }),
  ],
})
export class GqlModule {}

export * from './pagination';
export { registerObjectType } from './register';
