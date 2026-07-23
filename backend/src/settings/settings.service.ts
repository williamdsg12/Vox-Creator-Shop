import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../common/supabase.service';

@Injectable()
export class SettingsService {
  constructor(private supabaseService: SupabaseService) {}

  async getPlans() {
    const db = this.supabaseService.getMemoryDb();
    return db.plans;
  }

  async updatePlans(plansData: any[]) {
    const db = this.supabaseService.getMemoryDb();
    if (!Array.isArray(plansData)) {
      throw new BadRequestException('Formato de dados de planos inválido.');
    }

    db.plans = plansData.map((p) => ({
      id: p.id,
      name: p.name || (p.id === 'pro' ? 'Vox PRO' : 'Vox ULTRA'),
      price: Number(p.price),
      interval: p.interval || 'monthly',
      features: Array.isArray(p.features) ? p.features : [],
      is_active: p.is_active !== false,
    }));

    db.admin_logs.push({
      id: `log-${Date.now()}`,
      action: 'UPDATE_PLANS',
      target: 'settings/plans',
      details: { updatedCount: db.plans.length },
      created_at: new Date().toISOString(),
    });

    return db.plans;
  }

  async getLandingMedia() {
    const db = this.supabaseService.getMemoryDb();
    return {
      heroVideoUrl: db.landing_settings.hero_video_url,
    };
  }

  async updateLandingMedia(videoUrl: string) {
    const db = this.supabaseService.getMemoryDb();
    if (!videoUrl) {
      throw new BadRequestException('A URL ou arquivo de vídeo é obrigatório.');
    }

    db.landing_settings.hero_video_url = videoUrl;

    db.admin_logs.push({
      id: `log-${Date.now()}`,
      action: 'UPDATE_LANDING_MEDIA',
      target: 'settings/landing-media',
      details: { videoUrl },
      created_at: new Date().toISOString(),
    });

    return {
      message: 'Mídia da landing page atualizada com sucesso.',
      heroVideoUrl: db.landing_settings.hero_video_url,
    };
  }
}
