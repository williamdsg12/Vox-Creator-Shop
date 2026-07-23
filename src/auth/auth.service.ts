import {
  Injectable,
  OnModuleInit,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../common/supabase.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

const ADMIN_EMAIL = 'admin@voxcreator.shop';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private jwtService: JwtService,
    private supabaseService: SupabaseService,
  ) {}

  async onModuleInit() {
    // Garante que o admin padrão exista no banco real (idempotente).
    try {
      const db = this.supabaseService.getClient();
      const { data: existingAdmin } = await db
        .from('users')
        .select('id')
        .eq('email', ADMIN_EMAIL)
        .maybeSingle();

      if (!existingAdmin) {
        const passwordHash = bcrypt.hashSync('admin123', 10);
        await db.from('users').insert({
          email: ADMIN_EMAIL,
          password_hash: passwordHash,
          name: 'Administrador Vox Control',
          role: 'admin',
        });
      }
    } catch (err) {
      // Não derruba o boot da aplicação se o seed falhar (ex.: tabela ainda não migrada).
      console.warn('[AuthService] Falha ao verificar/criar admin padrão:', err.message);
    }
  }

  async register(dto: RegisterDto) {
    const db = this.supabaseService.getClient();

    const { data: existing } = await db
      .from('users')
      .select('id')
      .eq('email', dto.email)
      .maybeSingle();

    if (existing) {
      throw new ConflictException('E-mail já cadastrado na plataforma.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const { data: newUser, error: insertError } = await db
      .from('users')
      .insert({
        email: dto.email,
        password_hash: passwordHash,
        name: dto.name || dto.email.split('@')[0],
        role: 'user',
      })
      .select()
      .single();

    if (insertError || !newUser) {
      throw new InternalServerErrorException('Não foi possível criar a conta. Tente novamente.');
    }

    const trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await db.from('licenses').insert({
      user_id: newUser.id,
      plan_id: 'pro',
      status: 'trial',
      trial_ends_at: trialEndsAt,
      credits_remaining: 50,
    });

    const token = this.generateToken(newUser);
    return {
      user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    };
  }

  async login(dto: LoginDto) {
    const db = this.supabaseService.getClient();
    const { data: user } = await db
      .from('users')
      .select('*')
      .eq('email', dto.email)
      .maybeSingle();

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    const token = this.generateToken(user);
    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    };
  }

  async adminLogin(dto: LoginDto) {
    const res = await this.login(dto);
    if (res.user.role !== 'admin') {
      throw new UnauthorizedException('Acesso restrito a administradores Vox Control.');
    }
    return res;
  }

  async getMe(userId: string) {
    const db = this.supabaseService.getClient();
    const { data: user } = await db.from('users').select('*').eq('id', userId).maybeSingle();
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado.');
    }
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '1d' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }
}
