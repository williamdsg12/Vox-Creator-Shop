// api/index.js — Vercel Serverless Function entrypoint for NestJS Backend
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../backend/dist/src/app.module.js';

let app;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.enableCors({
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });
    await app.init();
  }
  return app;
}

export default async function handler(req, res) {
  try {
    const instance = await bootstrap();
    const httpAdapter = instance.getHttpAdapter();
    return httpAdapter.getInstance()(req, res);
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message || 'Internal Server Error' });
  }
}
