import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../common/supabase.service';
export declare class SubscriptionService {
    private configService;
    private supabaseService;
    constructor(configService: ConfigService, supabaseService: SupabaseService);
    getProducts(): Promise<any[]>;
    createCheckoutSession(userId: string, planId: string): Promise<{
        url: string;
        sessionId: string;
        plan: any;
        amount: any;
    }>;
    handleWebhook(event: any): Promise<{
        received: boolean;
    }>;
    getMySubscription(userId: string): Promise<{
        status: any;
        plan: any;
        currentPeriodEnd: any;
    }>;
    cancelSubscription(userId: string): Promise<{
        message: string;
    }>;
}
