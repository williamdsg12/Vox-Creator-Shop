import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { SupabaseService } from '../common/supabase.service';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService, SupabaseService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
