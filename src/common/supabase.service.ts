import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private readonly logger = new Logger(SupabaseService.name);
  private client: SupabaseClient | null = null;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL') || 'https://placeholder.supabase.co';
    const key = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') || 'placeholder-service-key';

    if (!this.configService.get<string>('SUPABASE_URL') || !this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY')) {
      this.logger.warn(
        'SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configurados. Inicializando cliente em modo de resiliência/offline.',
      );
    }

    try {
      this.client = createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
    } catch (err) {
      this.logger.warn(`Erro ao inicializar SupabaseClient: ${err.message}`);
    }
  }

  onModuleInit() {
    this.logger.log('SupabaseService inicializado.');
  }

  getClient(): SupabaseClient {
    if (!this.client) {
      const url = 'https://placeholder.supabase.co';
      const key = 'placeholder-service-key';
      this.client = createClient(url, key, { auth: { persistSession: false } });
    }
    return this.client;
  }
}
