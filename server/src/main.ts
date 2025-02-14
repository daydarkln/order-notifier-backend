import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.NODE_ENV === 'production'
          ? 'https://order-notifier.vercel.app'
          : 'http://localhost:5173',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true
    },
  });

  const config = new DocumentBuilder()
    .setTitle('Shawarma Order Notification System')
    .setDescription('API documentation for Shawarma Order Notification System')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Сохраняем OpenAPI спецификацию в JSON файл
  writeFileSync('./openapi.json', JSON.stringify(document, null, 2));

  SwaggerModule.setup('api', app, document);

  await app.listen(5000);
}
bootstrap();
