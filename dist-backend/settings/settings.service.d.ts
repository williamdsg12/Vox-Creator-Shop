import { SupabaseService } from '../common/supabase.service';
export declare class SettingsService {
    private supabaseService;
    constructor(supabaseService: SupabaseService);
    getPlans(): Promise<any[]>;
    updatePlans(plansData: any[]): Promise<any[]>;
    getLandingMedia(): Promise<{
        heroVideoUrl: any;
    }>;
    updateLandingMedia(videoUrl: string): Promise<{
        message: string;
        heroVideoUrl: string;
    }>;
}
