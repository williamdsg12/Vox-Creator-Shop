import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../common/supabase.service';

@Injectable()
export class SettingsService {
  constructor(private supabaseService: SupabaseService) {}

  async getPlans() {
    const db = this.supabaseService.getClient();
    const { data } = await db.from('plans').select('*').order('price', { ascending: true });
    return data || [];
  }

  async updatePlans(plansData: any[]) {
    const db = this.supabaseService.getClient();
    if (!Array.isArray(plansData)) {
      throw new BadRequestException('Formato de dados de planos inválido.');
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
      throw new BadRequestException('Não foi possível atualizar os planos.');
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

  async updateLandingMedia(videoUrl: string) {
    const db = this.supabaseService.getClient();
    if (!videoUrl) {
      throw new BadRequestException('A URL ou arquivo de vídeo é obrigatório.');
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
}
