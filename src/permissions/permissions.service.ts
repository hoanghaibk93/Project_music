import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from 'src/users/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';

@Injectable()
export class PermissionsService {
  constructor(@InjectModel(Permission.name) private permissionModel: SoftDeleteModel<PermissionDocument>) { }
  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const { name, apiPath, method, module } = createPermissionDto;
    const isExist = await this.permissionModel.findOne({ apiPath, method })
    if (isExist) {
      throw new BadRequestException(`Permission với apiPath=${apiPath}, method=${method} đã tồn tại`)
    }
    const permission = await this.permissionModel.create({
      ...createPermissionDto,
      createBy: {
        _id: user._id,
        email: user.email
      }
    })
    return permission;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current
    delete filter.pageSize
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.permissionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.permissionModel.find(filter)
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
      const permission = await this.permissionModel.findOne({ _id: id });
      return permission
    } catch (error) {
      console.log(error);
      return { message: 'not found permission' }
    }
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) {
    try {
      const permission = await this.permissionModel.updateOne(
        { _id: id },
        {
          ...updatePermissionDto, updateBy: {
            _id: user._id,
            email: user.email
          }
        });
      return permission
    } catch (error) {
      console.log(error);
      return { message: 'not found permission' }
    }
  }

  async remove(id: string, user: IUser) {
    try {
      await this.permissionModel.updateOne(
        { _id: id },
        {
          deleteBy: {
            _id: user._id,
            email: user.email
          }
        })
      return await this.permissionModel.softDelete({ _id: id });
    } catch (error) {
      console.log(error);
      return { message: 'not found permission' }
    }
  }
}
