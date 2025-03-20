import type { Stripe } from 'stripe';

import { defineModuleConfig } from '../../base';

export interface PaymentStartupConfig {
  stripe?: {
    keys: {
      APIKey: string;
      webhookKey: string;
    };
  } & Stripe.StripeConfig;
}

export interface PaymentRuntimeConfig {
  showLifetimePrice: boolean;
}

declare global {
  interface NewAppConfig {
    payment: {
      enabled: boolean;
      showLifetimePrice: boolean;
      stripe: {
        keys: ConfigItem<{
          APIKey: string;
          webhookKey: string;
        }>;
      } & Stripe.StripeConfig;
    };
  }
}

defineModuleConfig('payment', {
  enabled: {
    desc: 'Whether enable payment plugin',
    default: false,
  },
  showLifetimePrice: {
    desc: 'Whether enable lifetime price and allow user to pay for it.',
    default: true,
  },
  'stripe.keys': {
    desc: 'Stripe API keys',
    default: {
      APIKey: '',
      webhookKey: '',
    },
  },
});
