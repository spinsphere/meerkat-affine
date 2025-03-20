import { DynamicModule } from '@nestjs/common';

import { ConfigLoader } from './loader';
import { Config, ConfigProvider } from './provider';

export class ConfigModule {
  static forRoot(overrides: DeepPartial<NewAppConfig> = {}): DynamicModule {
    return {
      global: true,
      module: ConfigModule,
      providers: [
        ConfigProvider,
        ConfigLoader,
        ConfigLoader.withOverrides(overrides),
      ],
      exports: [ConfigProvider],
    };
  }
}

export { Config };
export { defineModuleConfig } from './register';
