import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TransformInterceptor } from './core/transform.interceptor';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configSerivce = app.get(ConfigService)

  const reflector = app.get(Reflector);
  // Sử dụng authGuard global (trong file main, có thể làm trong file app.module như hướng dẩn)
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  // khai báo để sử dụng interceptor để định dạng global kiểu dữ liệu trả về cho client
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  console.log("check path1: ", __dirname);
  console.log("check path: ", join(__dirname, '..', 'views'));

  app.setViewEngine('ejs');

  app.useGlobalPipes(new ValidationPipe());
  
  //config cookies
  app.use(cookieParser());

  //config cors
  app.enableCors(
    {
      "origin": "*",
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "preflightContinue": false,
      "optionsSuccessStatus": 204
    }
  );
  //config version
  app.setGlobalPrefix('api')
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1', '2']
  });

  await app.listen(configSerivce.get<string>("PORT"));
}
bootstrap();
