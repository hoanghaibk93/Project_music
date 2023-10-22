import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  hasPassword = (password: string) => {
    const bcrypt = require('bcryptjs');
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }
  async create(createUserDto: CreateUserDto) {

    const hashPassword = this.hasPassword(createUserDto.password);

    let user = await this.userModel.create({ ...createUserDto, password: hashPassword });
    return user;

  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    try {
      return await this.userModel.findOne({ _id: id });
    } catch (error) {
      return 'not found user'
    }

  }

  async findOneByUserName(username: string) {
    return await this.userModel.findOne(
      { email: username }
    );

  }
  isValidPassword(password: string, hash: string) {
    const bcrypt = require('bcryptjs');
    return bcrypt.compareSync(password, hash);
  }


  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({ _id: updateUserDto._id }, { ...updateUserDto });
  }

  async remove(id: string) {
    try {
      return await this.userModel.deleteOne({ _id: id });
    } catch (error) {
      return 'not found user'
    }

  }
}
