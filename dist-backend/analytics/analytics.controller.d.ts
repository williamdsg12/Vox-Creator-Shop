import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getOverview(): Promise<{
        activeSubscribers: number;
        mrr: any;
        conversionRate: string;
        churnRate: string;
        totalUsers: number;
    }>;
    getTimeseries(): Promise<{
        month: string;
        revenue: number;
    }[]>;
    getUsers(): Promise<{
        id: any;
        name: any;
        email: any;
        role: any;
        createdAt: any;
        licenseStatus: any;
        planId: any;
    }[]>;
    getLogs(): Promise<any[]>;
}
