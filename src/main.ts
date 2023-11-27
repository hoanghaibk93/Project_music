import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configSerivce = app.get(ConfigService)
  
  // Sử dụng authGuard global (trong file main, có thể làm trong file app.module như hướng dẩn)
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  console.log("check path1: ", __dirname);
  console.log("check path: ", join(__dirname, '..', 'views'));

  app.setViewEngine('ejs');

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(configSerivce.get<string>("PORT"));
}
bootstrap();
