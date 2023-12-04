import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Permission } from 'src/permissions/schemas/permission.schema';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role {
    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    isActive: boolean;

    @Prop({type: [mongoose.Schema.Types.ObjectId], ref: Permission.name})
    permissions: Permission[];

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

export const RoleSchema = SchemaFactory.createForClass(Role);

