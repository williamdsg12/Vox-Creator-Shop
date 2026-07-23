import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../common/supabase.service';

@Injectable()
export class LicenseService {
  constructor(private supabaseService: SupabaseService) {}

  async getStatus(userId: string) {
    const db = this.supabaseService.getClient();
    let { data: license } = await db
      .from('licenses')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!license) {
      const trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      const { data: created } = await db
        .from('licenses')
        .insert({
          user_id: userId,
          plan_id: 'pro',
          status: 'trial',
          trial_ends_at: trialEndsAt,
          credits_remaining: 50,
        })
        .select()
        .single();
      license = created;
    }

    const { data: plan } = await db
      .from('plans')
      .select('*')
      .eq('id', license.plan_id)
      .maybeSingle();

    const now = new Date();
    const trialEnd = new Date(license.trial_ends_at);
    const daysRemaining = Math.max(
      0,
      Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
    );

    return {
      licenseId: license.id,
      status: license.status,
      plan: plan ? { id: plan.id, name: plan.name, price: plan.price } : null,
      trialEndsAt: license.trial_ends_at,
      daysRemaining,
      creditsRemaining: license.credits_remaining,
    };
  }

  async activateLicense(userId: string, planId: string) {
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

    return this.getStatus(userId);
  }

  async revokeLicense(userId: string) {
    const db = this.supabaseService.getClient();
    const { data: license } = await db
      .from('licenses')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (!license) {
      throw new NotFoundException('Licença não encontrada.');
    }

    await db.from('licenses').update({ status: 'expirado' }).eq('user_id', userId);
    return { message: 'Licença revogada com sucesso.' };
  }
}
