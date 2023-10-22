import { Controller, Get, Post, Render, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './auth/local-auth.guard';
require('dotenv').config()


@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private configService: ConfigService

  ) { }

  // @Get()
  // @Render("home")
  // handleHomePage() {
  //   console.log("check", this.configService.get<string>("PORT"));
  //   const message = this.appService.getHello();
  //   return {
  //     message: message
  //   }
  // }
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  handleLogin(@Request() req) {
  return req.user
  }
}
