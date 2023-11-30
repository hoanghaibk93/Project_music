import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/users/user.interface';
import { log } from 'console';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
  ) {
    // quá trình decode, giải mã access-token  khi client gửi lên xem có hợp lệ không
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    });
  }
  //nếu access-token hợp lệ thì trả thông tin về người dùng
  async validate(payload: IUser) {
   

    const { _id, name, email, role } = payload;
    //req.user
    return {
      _id,
      name,
      email,
      role
    };
  }
}