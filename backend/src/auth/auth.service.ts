import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../common/supabase.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private supabaseService: SupabaseService,
  ) {
    // Seed default admin if not exists
    const db = this.supabaseService.getMemoryDb();
    if (!db.users.find((u) => u.email === 'admin@voxcreator.shop')) {
      const passwordHash = bcrypt.hashSync('admin123', 10);
      db.users.push({
        id: 'admin-id-001',
        email: 'admin@voxcreator.shop',
        password_hash: passwordHash,
        name: 'Administrador Vox Control',
        role: 'admin',
        created_at: new Date().toISOString(),
      });
    }
  }

  async register(dto: RegisterDto) {
    const db = this.supabaseService.getMemoryDb();
    const existing = db.users.find((u) => u.email === dto.email);
    if (existing) {
      throw new ConflictException('E-mail já cadastrado na plataforma.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const newUser = {
      id: `user-${Date.now()}`,
      email: dto.email,
      password_hash: passwordHash,
      name: dto.name || dto.email.split('@')[0],
      role: 'user',
      created_at: new Date().toISOString(),
    };

    db.users.push(newUser);

    // Initial Trial License
    const newLicense = {
      id: `license-${Date.now()}`,
      user_id: newUser.id,
      plan_id: 'pro',
      status: 'trial',
      trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      credits_remaining: 50,
      created_at: new Date().toISOString(),
    };
    db.licenses.push(newLicense);

    const token = this.generateToken(newUser);
    return {
      user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    };
  }

  async login(dto: LoginDto) {
    const db = this.supabaseService.getMemoryDb();
    const user = db.users.find((u) => u.email === dto.email);
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
    const db = this.supabaseService.getMemoryDb();
    const user = db.users.find((u) => u.id === userId);
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
