import { Body, Controller, Get, HttpStatus, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from '../client/request';
import { GoogleOAuthGuard } from '../guards/google-oauth.guard';
import BaseService from '../service/base.service';
import { SignUpDto } from '../user/dto/sign-up.dto';
import { UserService } from '../user/user.service';
import { ResponseDTO } from '../utils/response.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController extends BaseService {
    private logger: Logger = new Logger('AUTH CONTROLLER')
    constructor(
        private userService: UserService,
        private authService: AuthService
    ) {
       super()
    }

    @Post('register')
    async register(@Body() RegisterDTO: SignUpDto):Promise<ResponseDTO> {
        return await this.userService.create(RegisterDTO)
    }

    @Post('login')
    async login(@Body() UserDTO: LoginDto):Promise<ResponseDTO> {
       return await this.userService.findByLogin(UserDTO)
    }

    @Get("/facebook")
    @UseGuards(AuthGuard("facebook"))
    async facebookLogin(): Promise<any> {
        return HttpStatus.OK;
    }

    @Get("/facebook/redirect")
    @UseGuards(AuthGuard("facebook"))
    async facebookLoginRedirect(@Req() req: Request): Promise<any> {
        return this.userService.registerByFacebook(req.user['user'])
       
    }

    @Get("/google")
    @UseGuards(GoogleOAuthGuard)
    async googleAuth(@Req() req:Request) { }

    @Get('/google/redirect')
    @UseGuards(GoogleOAuthGuard)
    googleAuthRedirect(@Req() req:Request) {
        // return this.appService.googleLogin(req);
    }
}
