import { createPrivateKey, createPublicKey } from 'node:crypto';

import { defineModuleConfig } from '../config';

declare global {
  interface NewAppConfig {
    crypto: {
      secret: ConfigItem<{
        privateKey: string;
        publicKey: string;
      }>;
    };
  }
}

// Don't use this in production
const examplePrivateKey = `-----BEGIN EC PRIVATE KEY-----
MHcCAQEEIEtyAJLIULkphVhqXqxk4Nr8Ggty3XLwUJWBxzAWCWTMoAoGCCqGSM49
AwEHoUQDQgAEF3U/0wIeJ3jRKXeFKqQyBKlr9F7xaAUScRrAuSP33rajm3cdfihI
3JvMxVNsS2lE8PSGQrvDrJZaDo0L+Lq9Gg==
-----END EC PRIVATE KEY-----`;

function generatePrivateKey(privateKey: string) {
  return createPrivateKey({
    key: Buffer.from(privateKey),
    format: 'pem',
    type: 'sec1',
  })
    .export({
      format: 'pem',
      type: 'pkcs8',
    })
    .toString('utf8');
}

function generatePublicKey(privateKey: string) {
  return createPublicKey({
    key: Buffer.from(privateKey),
  })
    .export({ format: 'pem', type: 'spki' })
    .toString('utf8');
}

defineModuleConfig('crypto', {
  secret: {
    desc: 'The private key for used by the crypto module to create signed tokens or encrypt data.',
    env: envs => {
      const privateKey = envs.AFFINE_PRIVATE_KEY ?? examplePrivateKey;
      return {
        privateKey: generatePrivateKey(privateKey),
        publicKey: generatePublicKey(privateKey),
      };
    },
  },
});
