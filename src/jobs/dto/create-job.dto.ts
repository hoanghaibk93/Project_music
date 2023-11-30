import { Transform, Type } from 'class-transformer';
import { IsArray, IsDate, IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from 'class-validator';
import mongoose from 'mongoose';

//data transfer object
class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    name: string;
}

export class CreateJobDto {
    @IsNotEmpty({ message: 'Name không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'Skills không được để trống' })
    @IsArray({ message: 'Skills có định dạng là array' })
    // Mỗi phần tử là string
    @IsString({ each: true, message: 'Mỗi phần tử trong Skills có định dạng là string' })
    skills: string[];

    @IsNotEmpty({ message: 'Salary không được để trống' })
    salary: number;

    @IsNotEmpty({ message: 'Quantity không được để trống' })
    quantity: number;

    @IsNotEmpty({ message: 'Level không được để trống' })
    level: string;

    @IsNotEmpty({ message: 'Description không được để trống' })
    description: string;

    @IsNotEmpty({ message: 'StartDate không được để trống' })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: 'StartDate có định dạng là Date' })
    startDate: Date;

    @IsNotEmpty({ message: 'EndDate không được để trống' })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: 'EndDate có định dạng là Date' })
    endDate: Date;

    @IsNotEmpty({ message: 'isActive không được để trống' })
    isActive: boolean;

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;
}
