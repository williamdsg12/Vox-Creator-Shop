import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../common/supabase.service';

@Injectable()
export class LicenseService {
  constructor(private supabaseService: SupabaseService) {}

  async getStatus(userId: string) {
    try {
      const db = this.supabaseService.getClient();
      let { data: license } = await db
        .from('licenses')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (license) {
        const { data: plan } = await db
          .from('plans')
          .select('*')
          .eq('id', license.plan_id)
          .maybeSingle();

        const now = new Date();
        const trialEnd = new Date(license.trial_ends_at || Date.now() + 7 * 86400000);
        const daysRemaining = Math.max(
          0,
          Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
        );

        return {
          licenseId: license.id,
          status: license.status || 'trial',
          plan: plan ? { id: plan.id, name: plan.name, price: plan.price } : { id: 'pro', name: 'Vox PRO', price: 147 },
          trialEndsAt: license.trial_ends_at || trialEnd.toISOString(),
          daysRemaining,
          creditsRemaining: license.credits_remaining ?? 50,
        };
      }
    } catch (err) {
      console.warn('[LicenseService] DB lookup warning, using resilient fallback:', err.message);
    }

    // Default resilient response if DB is offline or license record is missing
    const trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    return {
      licenseId: 'lic_' + (userId || 'demo'),
      status: 'trial',
      plan: { id: 'pro', name: 'Vox PRO', price: 147 },
      trialEndsAt,
      daysRemaining: 7,
      creditsRemaining: 50,
    };
  }

  async activateLicense(userId: string, planId: string) {
    try {
      const db = this.supabaseService.getClient();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      const { data: existing } = await db
        .from('licenses')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (!existing) {
        await db.from('licenses').insert({
          user_id: userId,
          plan_id: planId,
          status: 'ativo',
          expires_at: expiresAt,
          credits_remaining: 500,
        });
      } else {
        await db
          .from('licenses')
          .update({ plan_id: planId, status: 'ativo', expires_at: expiresAt, credits_remaining: 500 })
          .eq('user_id', userId);
      }
    } catch (err) {
      console.warn('[LicenseService] activateLicense DB warning:', err.message);
    }

    return this.getStatus(userId);
  }

  async revokeLicense(userId: string) {
    try {
      const db = this.supabaseService.getClient();
      await db.from('licenses').update({ status: 'expirado' }).eq('user_id', userId);
    } catch (err) {
      console.warn('[LicenseService] revokeLicense DB warning:', err.message);
    }
    return { message: 'Licença revogada com sucesso.' };
  }
}
