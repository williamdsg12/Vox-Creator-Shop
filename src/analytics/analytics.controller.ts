import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('metrics/overview')
  async getOverview() {
    return this.analyticsService.getAdminOverview();
  }

  @Get('metrics/revenue-timeseries')
  async getTimeseries() {
    return this.analyticsService.getRevenueTimeseries();
  }

  @Get('users')
  async getUsers() {
    return this.analyticsService.getUsersList();
  }

  @Get('logs')
  async getLogs() {
    return this.analyticsService.getAuditLogs();
  }
}
