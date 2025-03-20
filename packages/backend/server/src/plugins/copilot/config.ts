import type { ClientOptions as OpenAIClientOptions } from 'openai';

import { defineModuleConfig } from '../../base';
import { StorageConfig } from '../../core/storage/config';
import type { FalConfig } from './providers/fal';
import { GoogleConfig } from './providers/google';
import { PerplexityConfig } from './providers/perplexity';

export interface CopilotStartupConfigurations {
  enabled: boolean;
  unsplash: ConfigItem<{
    key: string;
  }>;
  storage: StorageConfig;
  providers: {
    openai: ConfigItem<OpenAIClientOptions>;
    fal: ConfigItem<FalConfig>;
    google: ConfigItem<GoogleConfig>;
    perplexity: ConfigItem<PerplexityConfig>;
  };
}

declare global {
  interface NewAppConfig {
    copilot: CopilotStartupConfigurations;
  }
}

defineModuleConfig('copilot', {
  enabled: {
    desc: 'Whether to enable the copilot plugin.',
    default: false,
  },
  'providers.openai': {
    desc: 'The config for the openai provider.',
    default: {
      apiKey: '',
    },
    link: 'https://github.com/openai/openai-node',
  },
  'providers.fal': {
    desc: 'The config for the fal provider.',
    default: {
      apiKey: '',
    },
  },
  'providers.google': {
    desc: 'The config for the google provider.',
    default: {
      apiKey: '',
    },
  },
  'providers.perplexity': {
    desc: 'The config for the perplexity provider.',
    default: {
      apiKey: '',
    },
  },
  unsplash: {
    desc: 'The config for the unsplash key.',
    default: {
      key: '',
    },
  },
  storage: {
    desc: 'The config for the storage provider.',
    default: {
      provider: 'fs',
      bucket: 'copilot',
    },
  },
});
