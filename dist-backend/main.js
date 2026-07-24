"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT') || 3000;
    const frontendUrl = configService.get('FRONTEND_URL') || 'http://localhost:5173';
    app.enableCors({
        origin: [frontendUrl, 'http://localhost:5173', 'https://voxcreatorshop.vercel.app'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    await app.listen(port);
    console.log(`🚀 Vox Creator Shop Backend NestJS em execução na porta ${port} [http://localhost:${port}/api/v1]`);
}
bootstrap();
//# sourceMappingURL=main.js.map