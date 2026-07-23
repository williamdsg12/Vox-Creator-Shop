import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private client: SupabaseClient;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL');
    const key = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!url || !key) {
      throw new Error(
        'SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY precisam estar configurados nas variáveis de ambiente do backend.',
      );
    }

    this.client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  onModuleInit() {
    // Client pronto para uso pelos services via getClient().
  }

  getClient(): SupabaseClient {
    return this.client;
  }
}
