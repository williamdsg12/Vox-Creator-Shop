import { SupabaseService } from '../common/supabase.service';
export declare class LicenseService {
    private supabaseService;
    constructor(supabaseService: SupabaseService);
    getStatus(userId: string): Promise<{
        licenseId: any;
        status: any;
        plan: {
            id: any;
            name: any;
            price: any;
        };
        trialEndsAt: any;
        daysRemaining: number;
        creditsRemaining: any;
    }>;
    activateLicense(userId: string, planId: string): Promise<{
        licenseId: any;
        status: any;
        plan: {
            id: any;
            name: any;
            price: any;
        };
        trialEndsAt: any;
        daysRemaining: number;
        creditsRemaining: any;
    }>;
    revokeLicense(userId: string): Promise<{
        message: string;
    }>;
}
