import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../common/supabase.service';

@Injectable()
export class SubscriptionService {
  constructor(
    private configService: ConfigService,
    private supabaseService: SupabaseService,
  ) {}

  async getProducts() {
    const db = this.supabaseService.getClient();
    const { data } = await db.from('plans').select('*').eq('is_active', true);
    return data || [];
  }

  async createCheckoutSession(userId: string, planId: string) {
    const db = this.supabaseService.getClient();
    const { data: plan } = await db.from('plans').select('*').eq('id', planId).maybeSingle();
    if (!plan) {
      throw new BadRequestException('Plano selecionado inválido.');
    }

    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    const checkoutUrl =
      stripeSecretKey && !stripeSecretKey.includes('sua_chave')
        ? `https://checkout.stripe.com/pay/cs_test_${Date.now()}#plan=${planId}`
        : `https://voxcreatorshop.vercel.app/#checkout-success?plan=${planId}&session=${Date.now()}`;

    return {
      url: checkoutUrl,
      sessionId: `cs_test_${Date.now()}`,
      plan: plan.name,
      amount: plan.price,
    };
  }

  async handleWebhook(event: any) {
    const db = this.supabaseService.getClient();
    if (event.type === 'checkout.session.completed' || event.type === 'payment_intent.succeeded') {
      const userId = event.data?.object?.client_reference_id;
      const planId = event.data?.object?.metadata?.plan_id || 'pro';

      if (userId) {
        await db
          .from('licenses')
          .update({
            status: 'ativo',
            plan_id: planId,
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          })
          .eq('user_id', userId);
      }
    }
    return { received: true };
  }

  async getMySubscription(userId: string) {
    const db = this.supabaseService.getClient();
    const { data: license } = await db
      .from('licenses')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    const { data: plan } = await db
      .from('plans')
      .select('*')
      .eq('id', license?.plan_id || 'pro')
      .maybeSingle();

    return {
      status: license?.status || 'trial',
      plan,
      currentPeriodEnd: license?.expires_at || license?.trial_ends_at,
    };
  }

  async cancelSubscription(userId: string) {
    const db = this.supabaseService.getClient();
    await db.from('licenses').update({ status: 'cancelado' }).eq('user_id', userId);
    return { message: 'Assinatura cancelada com sucesso. Você terá acesso até o fim do período vigente.' };
  }
}
