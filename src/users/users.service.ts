import { Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserM, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './user.interface';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
  // constructor(@InjectModel(User.name) private userModel: Model<User>) { }
  // Cấu hình sử dụng xóa mềm
  constructor(@InjectModel(UserM.name) private userModel: SoftDeleteModel<UserDocument>) { }

  hasPassword = (password: string) => {
    const bcrypt = require('bcryptjs');
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }

  async create(createUserDto: CreateUserDto, user: IUser) {

    const hashPassword = this.hasPassword(createUserDto.password);

    let newUser = await this.userModel.create({
      ...createUserDto,
      password: hashPassword,
      createBy: {
        _id: user._id,
        email: user.email
      }
    });
    return newUser;
  }

  async register(registerUserDto: RegisterUserDto) {

    const hashPassword = this.hasPassword(registerUserDto.password);

    let user = await this.userModel.create({ ...registerUserDto, password: hashPassword, role: "USER" });
    return user;
  }

  async findAll(currentPage: number, limit: number, qs: string) {

    const { filter, sort, projection, population } = aqp(qs); 
    delete filter.current
    delete filter.pageSize
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.userModel.find(filter)
      .select('-password')
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
      const user = await this.userModel.findOne({ _id: id }).select('-password');
      return user
    } catch (error) {
      return 'not found user'
    }
  }

  async findOneByUserName(username: string) {
    return await this.userModel.findOne(
      { email: username }
    );
  }

  async findOneByEmail(email: string) {
    return await this.userModel.findOne(
      { email: email }
    );
  }

  isValidPassword(password: string, hash: string) {
    const bcrypt = require('bcryptjs');
    return bcrypt.compareSync(password, hash);
  }


  async update(updateUserDto: UpdateUserDto, user: IUser) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      {
        ...updateUserDto, updateBy: {
          _id: user._id,
          email: user.email
        }
      });
  }

  async remove(id: string, user: IUser) {
    try {
      await this.userModel.updateOne({ _id: id }, { deleteBy: { _id: user._id, email: user.email } });
      return await this.userModel.softDelete({ _id: id });
    } catch (error) {
      return 'not found user'
    }
  }
  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne(
      { _id },
      {
        refreshToken
      });
  }

  findUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne({refreshToken})
  }
}
