import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { ServerFeature } from './types';

@Injectable()
export class ServerService {
  private _initialized: boolean | null = null;
  readonly #features = new Set<ServerFeature>();
  constructor(private readonly db: PrismaClient) {}

  get features() {
    return Array.from(this.#features);
  }

  async initialized() {
    if (!this._initialized) {
      const userCount = await this.db.user.count();
      this._initialized = userCount > 0;
    }

    return this._initialized;
  }

  enableFeature(feature: ServerFeature) {
    this.#features.add(feature);
  }

  disableFeature(feature: ServerFeature) {
    this.#features.delete(feature);
  }
}
