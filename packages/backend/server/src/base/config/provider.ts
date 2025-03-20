import { FactoryProvider, Injectable } from '@nestjs/common';

import { ApplyType } from '../utils';
import { ConfigLoader } from './loader';

@Injectable()
export class Config extends ApplyType<NewAppConfig>() {}

export const ConfigProvider: FactoryProvider<Config> = {
  provide: Config,
  // @ts-expect-error allow
  useFactory: (loader: ConfigLoader) => loader.config,
  inject: [ConfigLoader],
};
