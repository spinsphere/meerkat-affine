import { RedisOptions } from 'ioredis';

import { defineModuleConfig } from '../config';

declare global {
  interface NewAppConfig {
    redis: {
      redis: ConfigItem<RedisOptions>;
    };
  }
}

defineModuleConfig('redis', {
  redis: {
    desc: 'The config for the redis client.',
    default: {},
  },
});
