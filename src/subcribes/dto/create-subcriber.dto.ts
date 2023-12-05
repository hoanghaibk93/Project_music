import { Transform, Type } from 'class-transformer';
import { IsArray, IsDate, IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from 'class-validator';
import mongoose from 'mongoose';


export class CreateSubcriberDto {
    @IsEmail({}, { message: "Email không đúng định dạng" })
    @IsNotEmpty({ message: 'Email không được để trống' })
    email: string;

    @IsNotEmpty({ message: 'Name không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'Skills không được để trống' })
    @IsArray({ message: 'Skills có định dạng là array' })
    // Mỗi phần tử là string
    @IsString({ each: true, message: 'Mỗi phần tử trong Skills có định dạng là string' })
    skills: string[];

}

