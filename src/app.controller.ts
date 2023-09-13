import {
    Controller,
    Get,
    Body,
    Post,
    BadRequestException,
    Inject,
    UnauthorizedException,
    Req,
    Request,
    Query
} from '@nestjs/common';
import {AppService} from './app.service';
import {UserDto} from './user.dto';
import {JwtService} from "@nestjs/jwt";

const users = [
    {username: 'ccfan', password: 'ccfan666', email: 'ccfan@666.com'},
    {username: 'ccyou', password: 'ccyou999', email: 'ccyou@999.com'},
    {username: 'guang', password: '666666', email: 'guang@999.com'},

]

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
    }

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

    @Get('aaa')
    aaa(@Req() req: Request) {
        const authorization = req.headers['authorization'];

        if (!authorization) {
            throw new BadRequestException('user not login');
        }

        try {
            const token = authorization.split(' ')[1];
            const data = this.jwtService.verify(token);

            console.log(data);
        } catch (e) {
            throw new UnauthorizedException('token timeout, please login again');
        }
    }

    @Get('refresh')
    refresh(@Query('token') token: string) {
        try {
            const data = this.jwtService.verify(token);

            const user = users.find(item => item.username === data.username);

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
                accessToken,
                refreshToken,
            }
        } catch (e) {
            throw new UnauthorizedException('token timeout, please login again');
        }

    }

}






























