import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { ClassSerializerInterceptor } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new PrismaExceptionFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); //to use exclude and expose

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
