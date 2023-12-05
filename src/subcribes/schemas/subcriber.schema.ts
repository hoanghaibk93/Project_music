import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type SubcriberDocument = HydratedDocument<Subcriber>;

@Schema({ timestamps: true })
export class Subcriber {
  @Prop()
  email: string;

  @Prop()
  name: string;

  @Prop()
  skills: string[];

  @Prop({ type: Object })
  createBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  updateBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  deleteBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

}

export const SubcriberSchema = SchemaFactory.createForClass(Subcriber);


