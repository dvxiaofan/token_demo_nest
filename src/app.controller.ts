import {
  Controller,
  Get,
  Body,
  Post,
  BadRequestException,
  Inject
} from '@nestjs/common';
import { AppService } from './app.service';
import { UserDto } from './user.dto';
import {JwtService} from "@nestjs/jwt";

const users = [
  { username: 'ccfan', password: 'ccfan666', email: 'ccfan@666.com' },
  { username: 'ccyou', password: 'ccyou999', email: 'ccyou@999.com' },
  { username: 'guang', password: '666666', email: 'guang@999.com' },

]

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject(JwtService)
  private jwtService: JwtService;

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

    const accessToken = this.jwtService.sign({
        username: user.username,
      email: user.email,
    }, {
      expiresIn: '0.5h'
    });

    const refreshToken = this.jwtService.sign({
        username: user.username,
    }, {
        expiresIn: '7d'
    });

    return {
      userInfo: {
        username: user.username,
        email: user.email,
      },
      accessToken,
      refreshToken,
    }
  }
}
