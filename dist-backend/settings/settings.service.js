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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../common/supabase.service");
let SettingsService = class SettingsService {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async getPlans() {
        const db = this.supabaseService.getClient();
        const { data } = await db.from('plans').select('*').order('price', { ascending: true });
        return data || [];
    }
    async updatePlans(plansData) {
        const db = this.supabaseService.getClient();
        if (!Array.isArray(plansData)) {
            throw new common_1.BadRequestException('Formato de dados de planos inválido.');
        }
        const rows = plansData.map((p) => ({
            id: p.id,
            name: p.name || (p.id === 'pro' ? 'Vox PRO' : 'Vox ULTRA'),
            price: Number(p.price),
            interval: p.interval || 'monthly',
            features: Array.isArray(p.features) ? p.features : [],
            is_active: p.is_active !== false,
        }));
        const { data, error } = await db.from('plans').upsert(rows).select();
        if (error) {
            throw new common_1.BadRequestException('Não foi possível atualizar os planos.');
        }
        await db.from('admin_logs').insert({
            action: 'UPDATE_PLANS',
            target: 'settings/plans',
            details: { updatedCount: rows.length },
        });
        return data;
    }
    async getLandingMedia() {
        const db = this.supabaseService.getClient();
        const { data } = await db
            .from('landing_settings')
            .select('value')
            .eq('key', 'hero_video_url')
            .maybeSingle();
        return {
            heroVideoUrl: data?.value ?? null,
        };
    }
    async updateLandingMedia(videoUrl) {
        const db = this.supabaseService.getClient();
        if (!videoUrl) {
            throw new common_1.BadRequestException('A URL ou arquivo de vídeo é obrigatório.');
        }
        await db.from('landing_settings').upsert({ key: 'hero_video_url', value: videoUrl });
        await db.from('admin_logs').insert({
            action: 'UPDATE_LANDING_MEDIA',
            target: 'settings/landing-media',
            details: { videoUrl },
        });
        return {
            message: 'Mídia da landing page atualizada com sucesso.',
            heroVideoUrl: videoUrl,
        };
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map