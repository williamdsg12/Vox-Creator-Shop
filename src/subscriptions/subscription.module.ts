import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { SupabaseService } from '../common/supabase.service';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService, SupabaseService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
