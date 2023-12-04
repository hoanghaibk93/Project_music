import { BadRequestException, Get, Injectable, Query } from '@nestjs/common';
import { CreateResumeDto, CreateUserCvDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { IUser } from 'src/users/user.interface';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { ResponseMessage } from 'src/decorator/customize';
import aqp from 'api-query-params';
import { log } from 'console';

@Injectable()
export class ResumesService {
  constructor(@InjectModel(Resume.name) private resumeModel: SoftDeleteModel<ResumeDocument>) { }

  async create(createUserCvDto: CreateUserCvDto, user: IUser) {
    const resume = await this.resumeModel.create({
      ...createUserCvDto,
      createBy: {
        _id: user._id,
        email: user.email
      },
      status: "PENDING",
      history: [
        {
          status: "PENDING",
          updatedAt: new Date(),
          updateBy: {
            _id: user._id,
            email: user.email
          }
        }
      ]
    })
    return resume;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current
    delete filter.pageSize
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.resumeModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.resumeModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population) // join đến collection khác
      .select(projection as any)
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
      const resume = await this.resumeModel.findOne({ _id: id });
      return resume
    } catch (error) {
      throw new BadRequestException(`not found resume with id=${id}`)
    }
  }

  async update(id: string, status: string, user: IUser) {
    try {
      const statusUpdate = await this.resumeModel.updateOne(
        { _id: id },
        {
          status,
          updateBy: {
            _id: user._id,
            email: user.email
          },
          $push: {
            history: {
              status,
              updatedAt: new Date(),
              updateBy: {
                _id: user._id,
                email: user.email
              }
            }
          }
        }
      );
      return statusUpdate

    } catch (error) {
      throw new BadRequestException(`not found resume with id=${id}`)
    }

  }

  async remove(id: string, user: IUser) {
    try {
      await this.resumeModel.updateOne(
        { _id: id },
        {
          deleteBy: {
            _id: user._id,
            email: user.email
          }
        })
      return await this.resumeModel.softDelete({ _id: id });
    } catch (error) {
      console.log(error);
      return { message: 'not found resume' }
    }
  }

  async getResumesByUser(user: IUser) {
    return this.resumeModel.find({ 'createBy._id': user._id })
      .sort("-createdAt")
      .populate([
        {
          path: "companyId",
          select: { name: 1 }
        },
        {
          path: "jobId",
          select: { name: 1 }
        }
      ])
  }
}


