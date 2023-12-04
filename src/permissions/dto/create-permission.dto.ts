import { Transform, Type } from 'class-transformer';
import { IsArray, IsDate, IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from 'class-validator';
import mongoose from 'mongoose';

export class CreatePermissionDto {
    @IsNotEmpty({ message: 'Name không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'ApiPath không được để trống' })
    apiPath: string;

    @IsNotEmpty({ message: 'Method không được để trống' })
    method: string;

    @IsNotEmpty({ message: 'Module không được để trống' })
    module: string;
}