import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173',
  });

  // Swagger / OpenAPI — спецификация генерируется из контроллеров и DTO.
  // Используется фронтом для codegen типов (openapi-typescript), чтобы
  // типы фронта никогда не расходились с реальным API-контрактом бэка.
  const config = new DocumentBuilder()
    .setTitle('Quiz & Poker API')
    .setDescription(
      'API для квизов, попыток прохождения и (в перспективе) покер-сессий',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // UI: http://localhost:3000/api/docs
  // Спецификация в формате JSON доступна по умолчанию на /api/docs-json —
  // именно её будет читать генератор типов на фронте.

  await app.listen(3000);
}
bootstrap();
