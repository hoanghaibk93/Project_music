import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUser } from 'src/users/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { ADMIN_ROLE } from 'src/databases/sample';

@Injectable()
export class RolesService {

  constructor(@InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>) { }
  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const isExist = await this.roleModel.findOne({ name: createRoleDto.name })
    if (isExist) {
      throw new BadRequestException(`Role với name=${createRoleDto.name} đã tồn tại`)
    }
    const role = await this.roleModel.create({
      ...createRoleDto,
      createBy: {
        _id: user._id,
        email: user.email
      }
    })
    return role;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current
    delete filter.pageSize
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.roleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.roleModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
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
      const role = (await this.roleModel.findOne({ _id: id })).populate({ path: "permissions", select: { _id: 1, apiPath: 1, name: 1, method: 1, module: 1 } });
      return role
    } catch (error) {
      console.log(error);
      return { message: 'not found role' }
    }
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('not found role')
    }
    // const isExist = await this.roleModel.findOne({ name: updateRoleDto.name })
    // if (isExist) {
    //   throw new BadRequestException(`Role với name=${updateRoleDto.name} đã tồn tại`)
    // }
    const role = await this.roleModel.updateOne(
      { _id: id },
      {
        ...updateRoleDto, updateBy: {
          _id: user._id,
          email: user.email
        }
      });
    return role
  }

  async remove(id: string, user: IUser) {
    try {
      const foundRole = await this.roleModel.findById(id);
      if(foundRole.name === ADMIN_ROLE) {
        throw new BadRequestException("Không thể xóa role ADMIN")
      }
      await this.roleModel.updateOne(
        { _id: id },
        {
          deleteBy: {
            _id: user._id,
            email: user.email
          }
        })
      return await this.roleModel.softDelete({ _id: id });
    } catch (error) {
      console.log(error);
      return { message: 'not found role' }
    }
  }
}
