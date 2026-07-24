import { SubscriptionService } from './subscription.service';
export declare class SubscriptionController {
    private readonly subscriptionService;
    constructor(subscriptionService: SubscriptionService);
    getProducts(): Promise<any[]>;
    checkout(req: any, planId: string): Promise<{
        url: string;
        sessionId: string;
        plan: any;
        amount: any;
    }>;
    webhook(event: any): Promise<{
        received: boolean;
    }>;
    getMySubscription(req: any): Promise<{
        status: any;
        plan: any;
        currentPeriodEnd: any;
    }>;
    cancelSubscription(req: any): Promise<{
        message: string;
    }>;
}
