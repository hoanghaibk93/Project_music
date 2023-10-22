import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configSerivce = app.get(ConfigService)
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  console.log("check path1: ", __dirname );
  console.log("check path: ", join(__dirname, '..', 'views') );
  
  app.setViewEngine('ejs');

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(configSerivce.get<string>("PORT"));
}
bootstrap();
