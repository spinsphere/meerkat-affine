import { Module } from '@nestjs/common';

import { PermissionModule } from '../../core/permission';
import { QuotaModule } from '../../core/quota';
import { LicenseResolver } from './resolver';
import { LicenseServiceProvider } from './service';

@Module({
  imports: [QuotaModule, PermissionModule],
  providers: [LicenseServiceProvider, LicenseResolver],
})
export class LicenseModule {}
