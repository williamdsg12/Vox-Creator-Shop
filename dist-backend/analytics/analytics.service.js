"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../common/supabase.service");
let AnalyticsService = class AnalyticsService {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async getAdminOverview() {
        const db = this.supabaseService.getClient();
        const { data: licenses } = await db.from('licenses').select('*');
        const { count: totalUsers } = await db.from('users').select('*', { count: 'exact', head: true });
        const { data: plans } = await db.from('plans').select('*');
        const activeLicenses = (licenses || []).filter((l) => l.status === 'ativo');
        const activeSubscribers = activeLicenses.length;
        const mrr = activeLicenses.reduce((acc, l) => {
            const plan = (plans || []).find((p) => p.id === l.plan_id);
            return acc + (plan ? Number(plan.price) : 0);
        }, 0);
        const total = totalUsers || 0;
        const conversionRate = total > 0 ? ((activeSubscribers / total) * 100).toFixed(1) : '0.0';
        return {
            activeSubscribers,
            mrr,
            conversionRate: `${conversionRate}%`,
            churnRate: '2.1%',
            totalUsers: total,
        };
    }
    async getRevenueTimeseries() {
        return [
            { month: 'Jan', revenue: 12400 },
            { month: 'Fev', revenue: 16800 },
            { month: 'Mar', revenue: 21500 },
            { month: 'Abr', revenue: 24200 },
            { month: 'Mai', revenue: 28450 },
        ];
    }
    async getUsersList() {
        const db = this.supabaseService.getClient();
        const { data: users } = await db.from('users').select('*');
        const { data: licenses } = await db.from('licenses').select('*');
        return (users || []).map((u) => {
            const license = (licenses || []).find((l) => l.user_id === u.id);
            return {
                id: u.id,
                name: u.name || 'Criador',
                email: u.email,
                role: u.role,
                createdAt: u.created_at,
                licenseStatus: license?.status || 'trial',
                planId: license?.plan_id || 'pro',
            };
        });
    }
    async getAuditLogs() {
        const db = this.supabaseService.getClient();
        const { data } = await db
            .from('admin_logs')
            .select('*')
            .order('created_at', { ascending: false });
        return data || [];
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map