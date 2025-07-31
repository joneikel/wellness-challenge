import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Convierte payloads a instancias de DTO
      whitelist: true, // Elimina campos no decorados
      forbidNonWhitelisted: true, // Lanza error si hay campos no permitidos
      disableErrorMessages: false, // Muestra mensajes de error detallados
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Wellenss-challenge')
    .setDescription('Documentación de la API Wellenss-challenge')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger/api-docs', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
