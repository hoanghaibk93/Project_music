import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job, JobDocument } from './schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/user.interface';
import aqp from 'api-query-params';

@Injectable()
export class JobsService {
  constructor(@InjectModel(Job.name) private jobModel: SoftDeleteModel<JobDocument>) { }

  async create(createJobDto: CreateJobDto, user: IUser) {
    const job = await this.jobModel.create({
      ...createJobDto,
      createBy: {
        _id: user._id,
        email: user.email
      }
    })
    return job;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current
    delete filter.pageSize
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.jobModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.jobModel.find(filter)
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
      const job = await this.jobModel.findOne({ _id: id });
      return job
    } catch (error) {
      console.log(error);
      return { message: 'not found user' }
    }
  }

  async update(id: string, updateJobDto: UpdateJobDto, user: IUser) {
    const job = await this.jobModel.updateOne(
      { _id: id },
      {
        ...updateJobDto, updateBy: {
          _id: user._id,
          email: user.email
        }
      });
    return job
  }

  async remove(id: string, user: IUser) {
    try {
      await this.jobModel.updateOne(
        { _id: id },
        {
          deleteBy: {
            _id: user._id,
            email: user.email
          }
        })
      return await this.jobModel.softDelete({ _id: id });
    } catch (error) {
      console.log(error);
      return { message: 'not found user' }
    }
  }
}
