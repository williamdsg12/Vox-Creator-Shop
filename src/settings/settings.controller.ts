import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('plans')
  async getPlans() {
    return this.settingsService.getPlans();
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put('plans')
  async updatePlans(@Body() plans: any[]) {
    return this.settingsService.updatePlans(plans);
  }

  @Get('landing-media')
  async getLandingMedia() {
    return this.settingsService.getLandingMedia();
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put('landing-media')
  async updateLandingMedia(@Body('videoUrl') videoUrl: string) {
    return this.settingsService.updateLandingMedia(videoUrl);
  }
}
