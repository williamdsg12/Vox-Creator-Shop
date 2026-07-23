import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../common/supabase.service';

@Injectable()
export class AnalyticsService {
  constructor(private supabaseService: SupabaseService) {}

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
    // Série histórica ilustrativa para o gráfico do painel admin.
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
}
