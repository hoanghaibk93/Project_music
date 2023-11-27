import { IsEmail, IsNotEmpty } from 'class-validator';

//data transfer object
export class CreateCompanyDto {
    @IsNotEmpty({
        message: 'Name không được để trống'
    })
    name: string;

    @IsNotEmpty({
        message: 'address không được để trống'
    })
    address: string;

    @IsNotEmpty({
        message: 'description không được để trống'
    })
    description: string;
 

}
