import { AiService } from './ai.service';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    generateScript(productName: string, category?: string, goal?: string): Promise<{
        script: string;
        generatedAt: string;
        provider: string;
    }>;
    sampleRequest(productName: string, creatorName?: string, followerCount?: string): Promise<{
        message: string;
        productName: string;
        generatedAt: string;
    }>;
}
