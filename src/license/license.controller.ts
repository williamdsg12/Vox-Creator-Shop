import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { LicenseService } from './license.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('license')
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}

  @UseGuards(JwtAuthGuard)
  @Get('status')
  async getStatus(@Req() req: any) {
    return this.licenseService.getStatus(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('activate')
  async activate(@Req() req: any, @Body('planId') planId: string) {
    return this.licenseService.activateLicense(req.user.userId, planId || 'pro');
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('revoke')
  async revoke(@Body('userId') userId: string) {
    return this.licenseService.revokeLicense(userId);
  }
}
