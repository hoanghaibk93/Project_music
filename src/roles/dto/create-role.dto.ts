import { Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsEmail, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested, isBoolean } from 'class-validator';
import mongoose from 'mongoose';
import { Permission } from 'src/permissions/schemas/permission.schema';


export class CreateRoleDto {
    @IsNotEmpty({ message: 'Name không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'Description không được để trống' })
    description: number;

    @IsNotEmpty({ message: 'IsActive không được để trống' })
    @IsBoolean({message: 'IsActive có giá trị boolean' })
    isActive: boolean;

    @IsNotEmpty({ message: 'permissions không được để trống' })
    @IsArray({ message: 'permissions có định dạng là array' })
    @IsMongoId({ each: true, message: 'Mỗi phần tử trong permissions có định dạng là object id' })
    permissions: Permission[];
}
