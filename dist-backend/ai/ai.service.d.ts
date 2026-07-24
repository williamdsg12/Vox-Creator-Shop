import { ConfigService } from '@nestjs/config';
export declare class AiService {
    private configService;
    private openai;
    constructor(configService: ConfigService);
    generateScript(data: {
        productName: string;
        category?: string;
        targetAudience?: string;
        goal?: string;
    }): Promise<{
        script: string;
        generatedAt: string;
        provider: string;
    }>;
    generateSampleRequest(data: {
        productName: string;
        creatorName?: string;
        followerCount?: string;
    }): Promise<{
        message: string;
        productName: string;
        generatedAt: string;
    }>;
    private getFallbackScript;
}
