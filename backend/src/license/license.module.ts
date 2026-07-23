import { Module } from '@nestjs/common';
import { LicenseService } from './license.service';
import { LicenseController } from './license.controller';
import { SupabaseService } from '../common/supabase.service';

@Module({
  controllers: [LicenseController],
  providers: [LicenseService, SupabaseService],
  exports: [LicenseService],
})
export class LicenseModule {}
