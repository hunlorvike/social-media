// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const port = process.env.PORT || 3000;
  console.log(`Application is running on: http://localhost:${port}`);

  // Enable CORS
  const corsOptions: CorsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  };

  app.enableCors(corsOptions);

  await app.listen(port);
}

bootstrap();
