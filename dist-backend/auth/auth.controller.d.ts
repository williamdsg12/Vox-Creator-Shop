import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    logout(): Promise<{
        message: string;
    }>;
    getMe(req: any): Promise<{
        id: any;
        email: any;
        name: any;
        role: any;
    }>;
}
