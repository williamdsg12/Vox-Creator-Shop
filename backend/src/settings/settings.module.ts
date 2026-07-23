import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { SupabaseService } from '../common/supabase.service';

@Module({
  controllers: [SettingsController],
  providers: [SettingsService, SupabaseService],
  exports: [SettingsService],
})
export class SettingsModule {}
