import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getPlans(): Promise<any[]>;
    updatePlans(plans: any[]): Promise<any[]>;
    getLandingMedia(): Promise<{
        heroVideoUrl: any;
    }>;
    updateLandingMedia(videoUrl: string): Promise<{
        message: string;
        heroVideoUrl: string;
    }>;
}
