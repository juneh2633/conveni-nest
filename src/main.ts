import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { PrismaService } from './common/prisma/prisma.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpErrorFilter } from './common/filter/HttpErrorFilter';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const prismaService = app.get(PrismaService);
  // await prismaService.enableShutdownHooks(app);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpErrorFilter());

  const config = new DocumentBuilder()
    .setTitle('convenii')
    .setDescription('convenii api document')
    .addTag('convenii')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
