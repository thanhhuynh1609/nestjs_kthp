import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { User as UserDocument } from '../types/user';
import { User } from '../utilities/user.decorator';

import { UserService } from './user.service';
import { UpdateUserDTO } from 'src/auth/auth.dto';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private userService: UserService) {}

  // ✅ Lấy thông tin user đang đăng nhập
  @Get('me')
  async getProfile(@User() user: UserDocument) {
    return {
      id: user.id,
      username: user.username,
      password: user.password,
      seller: user.seller,
      created: user.created,

      // có thể bổ sung thêm trường nếu cần
    };
  }

  // ✅ Cập nhật thông tin user
  @Put()
  async update(
    @User() user: UserDocument,
    @Body() userData: UpdateUserDTO,
  ) {
    return await this.userService.update(user.id, userData);
  }
}


  // @Put()
  // @UseGuards(AuthGuard('jwt'))
  // async update(
  //   @User() user: UserDocument,
  //   @Body() userData: UpdateUserDTO,
  // ) {
  //   return await this.userService.update(user.id, userData);
  // }
