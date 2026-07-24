import { OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../common/supabase.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService implements OnModuleInit {
    private jwtService;
    private supabaseService;
    constructor(jwtService: JwtService, supabaseService: SupabaseService);
    onModuleInit(): Promise<void>;
    register(dto: RegisterDto): Promise<{
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    adminLogin(dto: LoginDto): Promise<{
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    getMe(userId: string): Promise<{
        id: any;
        email: any;
        name: any;
        role: any;
    }>;
    private generateToken;
}
