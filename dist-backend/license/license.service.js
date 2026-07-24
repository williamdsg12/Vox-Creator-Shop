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
exports.LicenseService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../common/supabase.service");
let LicenseService = class LicenseService {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async getStatus(userId) {
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
                const daysRemaining = Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
                return {
                    licenseId: license.id,
                    status: license.status || 'trial',
                    plan: plan ? { id: plan.id, name: plan.name, price: plan.price } : { id: 'pro', name: 'Vox PRO', price: 147 },
                    trialEndsAt: license.trial_ends_at || trialEnd.toISOString(),
                    daysRemaining,
                    creditsRemaining: license.credits_remaining ?? 50,
                };
            }
        }
        catch (err) {
            console.warn('[LicenseService] DB lookup warning, using resilient fallback:', err.message);
        }
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
    async activateLicense(userId, planId) {
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
            }
            else {
                await db
                    .from('licenses')
                    .update({ plan_id: planId, status: 'ativo', expires_at: expiresAt, credits_remaining: 500 })
                    .eq('user_id', userId);
            }
        }
        catch (err) {
            console.warn('[LicenseService] activateLicense DB warning:', err.message);
        }
        return this.getStatus(userId);
    }
    async revokeLicense(userId) {
        try {
            const db = this.supabaseService.getClient();
            await db.from('licenses').update({ status: 'expirado' }).eq('user_id', userId);
        }
        catch (err) {
            console.warn('[LicenseService] revokeLicense DB warning:', err.message);
        }
        return { message: 'Licença revogada com sucesso.' };
    }
};
exports.LicenseService = LicenseService;
exports.LicenseService = LicenseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], LicenseService);
//# sourceMappingURL=license.service.js.map