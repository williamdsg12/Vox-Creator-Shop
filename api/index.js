// Função Serverless da Vercel — expõe o backend NestJS inteiro em /api/*
// Usa o build já compilado em backend/dist (gerado no passo de build, veja package.json).

const { NestFactory } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');
const { AppModule } = require('../backend/dist/app.module');

let cachedServer;

async function bootstrapServer() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });

  app.enableCors({
    origin: true, // mesma origem (Vercel) — libera geral, o front e o back agora vivem no mesmo domínio
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.init();
  return app.getHttpAdapter().getInstance();
}

module.exports = async (req, res) => {
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }
  return cachedServer(req, res);
};
