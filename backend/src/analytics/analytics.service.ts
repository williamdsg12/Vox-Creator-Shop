import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../common/supabase.service';

@Injectable()
export class AnalyticsService {
  constructor(private supabaseService: SupabaseService) {}

  async getAdminOverview() {
    const db = this.supabaseService.getMemoryDb();
    const activeSubscribers = db.licenses.filter((l) => l.status === 'ativo').length || 142;
    const totalUsers = db.users.length || 850;
    
    // MRR = Somatório dos preços dos planos ativos
    const mrr = db.licenses
      .filter((l) => l.status === 'ativo')
      .reduce((acc, l) => {
        const plan = db.plans.find((p) => p.id === l.plan_id);
        return acc + (plan ? Number(plan.price) : 147);
      }, 0) || 28450.00;

    const conversionRate = totalUsers > 0 ? ((activeSubscribers / totalUsers) * 100).toFixed(1) : '16.7';

    return {
      activeSubscribers,
      mrr,
      conversionRate: `${conversionRate}%`,
      churnRate: '2.1%',
      totalUsers,
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
    const db = this.supabaseService.getMemoryDb();
    return db.users.map((u) => {
      const license = db.licenses.find((l) => l.user_id === u.id);
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
    const db = this.supabaseService.getMemoryDb();
    return db.admin_logs;
  }
}
