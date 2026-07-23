import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @UseGuards(JwtAuthGuard)
  @Post('generate-script')
  async generateScript(
    @Body('productName') productName: string,
    @Body('category') category?: string,
    @Body('goal') goal?: string,
  ) {
    return this.aiService.generateScript({ productName, category, goal });
  }

  @UseGuards(JwtAuthGuard)
  @Post('sample-request')
  async sampleRequest(
    @Body('productName') productName: string,
    @Body('creatorName') creatorName?: string,
    @Body('followerCount') followerCount?: string,
  ) {
    return this.aiService.generateSampleRequest({ productName, creatorName, followerCount });
  }
}
