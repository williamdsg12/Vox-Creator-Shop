import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../common/supabase.service';

@Injectable()
export class LicenseService {
  constructor(private supabaseService: SupabaseService) {}

  async getStatus(userId: string) {
    const db = this.supabaseService.getMemoryDb();
    let license = db.licenses.find((l) => l.user_id === userId);

    if (!license) {
      license = {
        id: `license-${Date.now()}`,
        user_id: userId,
        plan_id: 'pro',
        status: 'trial',
        trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        credits_remaining: 50,
        created_at: new Date().toISOString(),
      };
      db.licenses.push(license);
    }

    const plan = db.plans.find((p) => p.id === license.plan_id) || db.plans[0];
    const now = new Date();
    const trialEnd = new Date(license.trial_ends_at);
    const daysRemaining = Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    return {
      licenseId: license.id,
      status: license.status,
      plan: {
        id: plan.id,
        name: plan.name,
        price: plan.price,
      },
      trialEndsAt: license.trial_ends_at,
      daysRemaining,
      creditsRemaining: license.credits_remaining,
    };
  }

  async activateLicense(userId: string, planId: string) {
    const db = this.supabaseService.getMemoryDb();
    let license = db.licenses.find((l) => l.user_id === userId);

    if (!license) {
      license = {
        id: `license-${Date.now()}`,
        user_id: userId,
        plan_id: planId,
        status: 'ativo',
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        credits_remaining: 500,
        created_at: new Date().toISOString(),
      };
      db.licenses.push(license);
    } else {
      license.plan_id = planId;
      license.status = 'ativo';
      license.expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      license.credits_remaining = 500;
    }

    return this.getStatus(userId);
  }

  async revokeLicense(userId: string) {
    const db = this.supabaseService.getMemoryDb();
    const license = db.licenses.find((l) => l.user_id === userId);
    if (!license) {
      throw new NotFoundException('Licença não encontrada.');
    }
    license.status = 'expirado';
    return { message: 'Licença revogada com sucesso.' };
  }
}
