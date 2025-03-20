import { Inject, Injectable, OnModuleInit, Provider } from '@nestjs/common';
import { merge } from 'lodash-es';

import { Models } from '../../models';
import { EventBus } from '../event';

const OVERRIDES_PROVIDE = Symbol('CONFIG_OVERRIDES');

declare global {
  interface Events {
    'config.changed': {
      updates: DeepPartial<NewAppConfig>;
    };
  }
}

@Injectable()
export class ConfigLoader implements OnModuleInit {
  static withOverrides(overrides: DeepPartial<NewAppConfig>): Provider {
    return {
      provide: OVERRIDES_PROVIDE,
      useValue: overrides,
    };
  }

  #config!: DeepReadonly<NewAppConfig>;

  constructor(
    private readonly models: Models,
    private readonly event: EventBus,
    @Inject(OVERRIDES_PROVIDE)
    private readonly overrides: DeepPartial<NewAppConfig>
  ) {}

  get config() {
    return this.#config;
  }

  async onModuleInit() {
    this.#config = Object.freeze(
      merge(this.loadDefaults(), await this.loadDatabase(), this.overrides)
    );
  }

  async override(updates: DeepPartial<NewAppConfig>) {
    await this.saveDatabase(updates);

    this.#config = Object.freeze(merge({}, this.#config, updates));
    const payload = { updates };

    this.event.emit('config.changed', payload);
    this.event.broadcast('config.changed', payload);
  }

  private loadDefaults(): NewAppConfig {
    return {} as any;
  }

  private async loadDatabase(): Promise<Partial<NewAppConfig>> {
    return {} as any;
  }

  private async saveDatabase(updates: DeepPartial<NewAppConfig>) {}
}
