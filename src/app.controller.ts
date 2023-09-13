import {Controller, Get, Body, Post, BadRequestException} from '@nestjs/common';
import { AppService } from './app.service';
import { UserDto } from './user.dto';

const users = [
  { username: 'ccfan', password: 'ccfan666', email: 'ccfan@666.com' },
  { username: 'ccyou', password: 'ccyou999', email: 'ccyou@999.com' },
]

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('login')
  login(@Body() userDto: UserDto) {
    const user = users.find(item => item.username === userDto.username);

    if (!user) {
      throw new BadRequestException('user not found');
    }

    if (user.password !== userDto.password) {
      throw new BadRequestException('password error');
    }

    return {
      userInfo: {
        username: user.username,
        email: user.email,
      },
      accessToken: '1234567890',
      refreshToken: '0987654321',
    }
  }
}
