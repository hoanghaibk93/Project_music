import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';



@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://hoanghaibk93:hoanghaibk93@cluster0.qiup1zv.mongodb.net/')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
