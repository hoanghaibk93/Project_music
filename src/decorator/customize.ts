import { SetMetadata } from '@nestjs/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// customize decorator Public()
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// customize message trả về cho client
export const RESPONSE_MESSAGE = 'response_message'
export const ResponseMessage = (message: string) =>
      SetMetadata(RESPONSE_MESSAGE, message);

// customize decorator User()
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);