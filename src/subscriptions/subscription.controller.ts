import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('products')
  async getProducts() {
    return this.subscriptionService.getProducts();
  }

  @UseGuards(JwtAuthGuard)
  @Post('subscriptions/checkout')
  async checkout(@Req() req: any, @Body('planId') planId: string) {
    return this.subscriptionService.createCheckoutSession(req.user.userId, planId || 'pro');
  }

  @Post('subscriptions/webhook')
  async webhook(@Body() event: any) {
    return this.subscriptionService.handleWebhook(event);
  }

  @UseGuards(JwtAuthGuard)
  @Get('subscriptions/me')
  async getMySubscription(@Req() req: any) {
    return this.subscriptionService.getMySubscription(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('subscriptions/cancel')
  async cancelSubscription(@Req() req: any) {
    return this.subscriptionService.cancelSubscription(req.user.userId);
  }
}
