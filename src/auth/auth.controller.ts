import { BadRequestException, Body, Controller, Get, Post, Render, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto, RegisterUserDto, UserLoginDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { Request, Response } from 'express';
import { IUser } from 'src/users/user.interface';
import { RolesService } from 'src/roles/roles.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiTags, ApiBody} from '@nestjs/swagger';

@ApiTags('auth')
@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService,
        private readonly usersService: UsersService,
        private rolesService: RolesService,
    ) { }

    @Public()
    @UseGuards(ThrottlerGuard)
    @UseGuards(LocalAuthGuard)
    @ApiBody({ type: UserLoginDto})
    @Post('/login')
    @ResponseMessage('User Login')
    handleLogin(
        @Req() req,
        @Res({ passthrough: true }) response: Response
    ) {
        return this.authService.login(req.user, response)
    }

    @Public()
    @ResponseMessage("Register a new user")
    @Post('/register')
    async handleRegister(@Body() registerUserDto: RegisterUserDto) {
        const userOld = await this.usersService.findOneByEmail(registerUserDto.email);
        if (userOld) {
            throw new BadRequestException(`The email ${userOld.email} đã tồn tại trong hệ thống`)
        }
        return this.authService.register(registerUserDto)
    }

    @ResponseMessage("Get user information")
    @Get('/account')
    async handleGetAccount(@User() user: IUser) {
        const temp = await this.rolesService.findOne(user.role._id) as any;
        user.permissions = temp.permissions;
        return { user }
    }

    @Public()
    @ResponseMessage("Get user by refresh token")
    @Get('/refresh')
    async handleRefreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
        const refreshToken = request.cookies["refresh_token"]

        return this.authService.processNewToken(refreshToken, response);
    }

    @ResponseMessage("Logout user")
    @Post('/logout')
    async handleLogout(@User() user: IUser, @Res({ passthrough: true }) response: Response) {

        return this.authService.logout(user, response);
    }
}
