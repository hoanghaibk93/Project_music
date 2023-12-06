import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SubcribersService } from './Subcribers.service';
import { CreateSubcriberDto } from './dto/create-Subcriber.dto';
import { UpdateSubcriberDto } from './dto/update-Subcriber.dto';
import { ResponseMessage, SkipCheckPermission, User } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';
import { ApiTags} from '@nestjs/swagger';

@ApiTags('subscribers')
@Controller('subscribers')
export class SubcribersController {
  constructor(private readonly SubcribersService: SubcribersService) { }

  @Post()
  @ResponseMessage("Create a new Subcriber")
  create(@Body() createSubcriberDto: CreateSubcriberDto, @User() user: IUser) {
    return this.SubcribersService.create(createSubcriberDto, user);
  }

  @Post("skills")
  @ResponseMessage("Get Subcriber's skills")
  @SkipCheckPermission()
  getUserSkills(@User() user: IUser) {
    return this.SubcribersService.getSkills(user);
  }

  @Get()
  @ResponseMessage('Fetch all Subcriber with paginate')
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string
  ) {
    return this.SubcribersService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Fetch a Subcriber by id')
  findOne(@Param('id') id: string) {
    return this.SubcribersService.findOne(id);
  }

  @Patch()
  @SkipCheckPermission()
  @ResponseMessage("Update a Subcriber")
  update(@Body() updateSubcriberDto: UpdateSubcriberDto, @User() user: IUser) {  
    return this.SubcribersService.update(updateSubcriberDto, user);
  }

  @Delete(':id')
  @ResponseMessage("Delete a Subcriber")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.SubcribersService.remove(id, user);
  }
}
