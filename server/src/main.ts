import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for Next.js frontend
  app.enableCors({
    origin: 'http://localhost:3001', // Next.js default port
    credentials: true,
  });
  
  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
