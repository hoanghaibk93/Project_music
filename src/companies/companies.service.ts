import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';

@Injectable()
export class CompaniesService {
  constructor(@InjectModel(Company.name) private companyModel: SoftDeleteModel<CompanyDocument>) { }

  async create(createCompanyDto: CreateCompanyDto, user: IUser) {
    const company = await this.companyModel.create({
      ...createCompanyDto,
      createBy: {
        _id: user._id,
        email: user.email
      }
    })
    return company;
  }

  findAll() {
    return `This action returns all companies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    const company = await this.companyModel.updateOne(
      { _id: id },
      {
        ...updateCompanyDto, updateBy: {
          _id: user._id,
          email: user.email
        }
      });
    return company
  }

  async remove(id: string, user: IUser) {
    try {
      await this.companyModel.updateOne(
        {_id: id },
        {
          deleteBy: {
            _id: user._id,
            email: user.email
          }
        })
      return await this.companyModel.softDelete({ _id: id });
    } catch (error) {
      console.log(error);
      return { message: 'not found user' }
    }

  }
}
