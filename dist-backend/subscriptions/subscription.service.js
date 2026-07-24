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
exports.SubscriptionService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_service_1 = require("../common/supabase.service");
let SubscriptionService = class SubscriptionService {
    constructor(configService, supabaseService) {
        this.configService = configService;
        this.supabaseService = supabaseService;
    }
    async getProducts() {
        const db = this.supabaseService.getClient();
        const { data } = await db.from('plans').select('*').eq('is_active', true);
        return data || [];
    }
    async createCheckoutSession(userId, planId) {
        const db = this.supabaseService.getClient();
        const { data: plan } = await db.from('plans').select('*').eq('id', planId).maybeSingle();
        if (!plan) {
            throw new common_1.BadRequestException('Plano selecionado inválido.');
        }
        const stripeSecretKey = this.configService.get('STRIPE_SECRET_KEY');
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
    async handleWebhook(event) {
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
    async getMySubscription(userId) {
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
    async cancelSubscription(userId) {
        const db = this.supabaseService.getClient();
        await db.from('licenses').update({ status: 'cancelado' }).eq('user_id', userId);
        return { message: 'Assinatura cancelada com sucesso. Você terá acesso até o fim do período vigente.' };
    }
};
exports.SubscriptionService = SubscriptionService;
exports.SubscriptionService = SubscriptionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        supabase_service_1.SupabaseService])
], SubscriptionService);
//# sourceMappingURL=subscription.service.js.map