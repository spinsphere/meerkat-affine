import { Injectable } from '@nestjs/common';

import { OAuthProviderName } from './config';
import type { OAuthProvider } from './providers/def';

@Injectable()
export class OAuthProviderFactory {
  readonly #providers = new Map<OAuthProviderName, OAuthProvider>();

  get providers() {
    return Array.from(this.#providers.keys());
  }

  get(name: OAuthProviderName): OAuthProvider | undefined {
    return this.#providers.get(name);
  }

  register(name: OAuthProviderName, provider: OAuthProvider) {
    this.#providers.set(name, provider);
  }

  unregister(name: OAuthProviderName) {
    this.#providers.delete(name);
  }
}
