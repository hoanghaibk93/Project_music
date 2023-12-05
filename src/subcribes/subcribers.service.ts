import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubcriberDto } from './dto/create-Subcriber.dto';
import { UpdateSubcriberDto } from './dto/update-Subcriber.dto';
import { IUser } from 'src/users/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Subcriber, SubcriberDocument } from './schemas/Subcriber.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';

@Injectable()
export class SubcribersService {
  constructor(@InjectModel(Subcriber.name) private SubcriberModel: SoftDeleteModel<SubcriberDocument>) { }

  async create(createSubcriberDto: CreateSubcriberDto, user: IUser) {

    const isExist = await this.SubcriberModel.findOne({ email: createSubcriberDto.email })
    if (isExist) {
      throw new BadRequestException(`Email với name=${createSubcriberDto.name} đã tồn tại`)
    }
    const Subcriberr = await this.SubcriberModel.create({
      ...createSubcriberDto,
      createBy: {
        _id: user._id,
        email: user.email
      }
    })
    return Subcriberr;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current
    delete filter.pageSize
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.SubcriberModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.SubcriberModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();
    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }

  async findOne(id: string) {
    try {
      const Subcriberr = await this.SubcriberModel.findOne({ _id: id });
      return Subcriberr
    } catch (error) {
      console.log(error);
      return { message: 'not found Subcriberr' }
    }
  }

  async update(updateSubcriberrDto: UpdateSubcriberDto, user: IUser) {
    const Subcriberr = await this.SubcriberModel.updateOne(
      { email: user.email },
      {
        ...updateSubcriberrDto,
        updateBy: {
          _id: user._id,
          email: user.email
        }
      },
      { upsert: true }
    );
    return Subcriberr
  }

  async remove(id: string, user: IUser) {
    try {
      await this.SubcriberModel.updateOne(
        { _id: id },
        {
          deleteBy: {
            _id: user._id,
            email: user.email
          }
        })
      return await this.SubcriberModel.softDelete({ _id: id });
    } catch (error) {
      console.log(error);
      return { message: 'not found Subcriber' }
    }
  }
  async getSkills(user: IUser) {
    const { email } = user;
    return await this.SubcriberModel.findOne({ email }, { skills: 1 })
  }
}
