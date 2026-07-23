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
    const db = this.supabaseService.getMemoryDb();
    return db.plans.filter((p) => p.is_active);
  }

  async createCheckoutSession(userId: string, planId: string) {
    const db = this.supabaseService.getMemoryDb();
    const plan = db.plans.find((p) => p.id === planId);
    if (!plan) {
      throw new BadRequestException('Plano selecionado inválido.');
    }

    // Retorna URL de checkout mock/stripe pronta para redirecionar o usuário
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    const checkoutUrl = stripeSecretKey && !stripeSecretKey.includes('sua_chave')
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
    const db = this.supabaseService.getMemoryDb();
    // Exemplo de webhook para atualizar licença após evento checkout.session.completed
    if (event.type === 'checkout.session.completed' || event.type === 'payment_intent.succeeded') {
      const userId = event.data?.object?.client_reference_id || 'user-1';
      const planId = event.data?.object?.metadata?.plan_id || 'pro';

      let license = db.licenses.find((l) => l.user_id === userId);
      if (license) {
        license.status = 'ativo';
        license.plan_id = planId;
        license.expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      }
    }
    return { received: true };
  }

  async getMySubscription(userId: string) {
    const db = this.supabaseService.getMemoryDb();
    const license = db.licenses.find((l) => l.user_id === userId);
    const plan = db.plans.find((p) => p.id === (license?.plan_id || 'pro'));

    return {
      status: license?.status || 'trial',
      plan: plan || db.plans[0],
      currentPeriodEnd: license?.expires_at || license?.trial_ends_at,
    };
  }

  async cancelSubscription(userId: string) {
    const db = this.supabaseService.getMemoryDb();
    const license = db.licenses.find((l) => l.user_id === userId);
    if (license) {
      license.status = 'cancelado';
    }
    return { message: 'Assinatura cancelada com sucesso. Você terá acesso até o fim do período vigente.' };
  }
}
