import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { LicenseModule } from './license/license.module';
import { SubscriptionModule } from './subscriptions/subscription.module';
import { SettingsModule } from './settings/settings.module';
import { ProductsModule } from './products/products.module';
import { AiModule } from './ai/ai.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { SupabaseService } from './common/supabase.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    LicenseModule,
    SubscriptionModule,
    SettingsModule,
    ProductsModule,
    AiModule,
    AnalyticsModule,
  ],
  providers: [SupabaseService],
})
export class AppModule {}
