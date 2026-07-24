import { SupabaseService } from '../common/supabase.service';
export declare class AnalyticsService {
    private supabaseService;
    constructor(supabaseService: SupabaseService);
    getAdminOverview(): Promise<{
        activeSubscribers: number;
        mrr: any;
        conversionRate: string;
        churnRate: string;
        totalUsers: number;
    }>;
    getRevenueTimeseries(): Promise<{
        month: string;
        revenue: number;
    }[]>;
    getUsersList(): Promise<{
        id: any;
        name: any;
        email: any;
        role: any;
        createdAt: any;
        licenseStatus: any;
        planId: any;
    }[]>;
    getAuditLogs(): Promise<any[]>;
}
