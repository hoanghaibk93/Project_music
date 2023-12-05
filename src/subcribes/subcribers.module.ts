import { Module } from '@nestjs/common';
import { SubcribersService } from './Subcribers.service';
import { SubcribersController } from './Subcribers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subcriber, SubcriberSchema } from './schemas/Subcriber.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Subcriber.name, schema: SubcriberSchema }])],
  controllers: [SubcribersController],
  providers: [SubcribersService]
})
export class SubcribersModule { }
