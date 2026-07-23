import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService {
  private memoryDb = {
    users: [],
    licenses: [],
    subscriptions: [],
    plans: [
      {
        id: 'pro',
        name: 'Vox PRO',
        price: 147.00,
        interval: 'monthly',
        features: [
          'Copiloto IA Ilimitado',
          'Teleprompter Inteligente',
          'Radar de Produtos em Alta',
          'Solicitador de Amostras Grátis',
          'Suporte VIP no WhatsApp'
        ],
        is_active: true
      },
      {
        id: 'ultra',
        name: 'Vox ULTRA',
        price: 297.00,
        interval: 'monthly',
        features: [
          'Tudo do plano PRO',
          'Múltiplas Contas TikTok Shop',
          'Extensão OS Chrome Enterprise',
          'Relatórios de ROAS/CPA Avançados',
          'Consultoria Quinzenal em Grupo'
        ],
        is_active: true
      }
    ],
    landing_settings: {
      hero_video_url: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-shot-of-a-woman-showing-clothing-41566-large.mp4'
    },
    admin_logs: []
  };

  constructor(private configService: ConfigService) {}

  getMemoryDb() {
    return this.memoryDb;
  }
}
