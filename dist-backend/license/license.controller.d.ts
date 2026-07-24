import { LicenseService } from './license.service';
export declare class LicenseController {
    private readonly licenseService;
    constructor(licenseService: LicenseService);
    getStatus(req: any): Promise<{
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
    activate(req: any, planId: string): Promise<{
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
    revoke(userId: string): Promise<{
        message: string;
    }>;
}
