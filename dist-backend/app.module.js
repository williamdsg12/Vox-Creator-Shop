"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const license_module_1 = require("./license/license.module");
const subscription_module_1 = require("./subscriptions/subscription.module");
const settings_module_1 = require("./settings/settings.module");
const products_module_1 = require("./products/products.module");
const ai_module_1 = require("./ai/ai.module");
const analytics_module_1 = require("./analytics/analytics.module");
const supabase_service_1 = require("./common/supabase.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            auth_module_1.AuthModule,
            license_module_1.LicenseModule,
            subscription_module_1.SubscriptionModule,
            settings_module_1.SettingsModule,
            products_module_1.ProductsModule,
            ai_module_1.AiModule,
            analytics_module_1.AnalyticsModule,
        ],
        providers: [supabase_service_1.SupabaseService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map