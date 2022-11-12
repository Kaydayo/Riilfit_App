import { Body, Controller, Get, HttpStatus, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from '../client/request';
import { GoogleOAuthGuard } from '../guards/google-oauth.guard';
import BaseService from '../service/base.service';
import { SignUpDto } from '../user/dto/sign-up.dto';
import { UserService } from '../user/user.service';
import { ResponseDTO } from '../utils/response.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ResponseSwagger } from '../utils/types'
import { SampleResponseDTO } from './dto/sample-response.dto';

@ApiTags("Authentication")
@Controller('auth')
export class AuthController extends BaseService {
    private logger: Logger = new Logger('AUTH CONTROLLER')
    constructor(
        private userService: UserService,
        private authService: AuthService
    ) {
        super()
    }

    @ApiOperation({
        summary: "Sign up into the application by providing the required information"
    })
    @ApiOkResponse({
        description: 'sign up response',
        type: SampleResponseDTO
    })
    @Post('register')
    async register(@Body() RegisterDTO: SignUpDto): Promise<ResponseDTO> {
        return await this.userService.create(RegisterDTO)
    }

    @ApiOperation({
        summary: "Get access to application with registered credentials"
    })
    @ApiOkResponse({
        description: 'login response',
        type: SampleResponseDTO
    })
    @Post('login')
    async login(@Body() UserDTO: LoginDto): Promise<ResponseDTO> {
        return await this.userService.findByLogin(UserDTO)
    }

    @ApiOperation({
        summary: "Sign up and login via facebook account"
    })
    @Get("/facebook")
    @UseGuards(AuthGuard("facebook"))
    async facebookLogin(): Promise<any> {
        return HttpStatus.OK;
    }

    @ApiOperation({
        summary: "This endpoint redirects user to app after facebook authentication"
    })
    @ApiOkResponse({
        description: 'Response on succesful facebook authentication',
        type: SampleResponseDTO
    })
    @Get("/facebook/redirect")
    @UseGuards(AuthGuard("facebook"))
    async facebookLoginRedirect(@Req() req: Request): Promise<any> {
        return await this.userService.registerByFacebook(req.user['user'])

    }

    @ApiOperation({
        summary: "Sign up and login via gmail account"
    })
    @Get("/google")
    @UseGuards(GoogleOAuthGuard)
    async googleAuth(@Req() req: Request): Promise<any> {
        return HttpStatus.OK;
    }

    @ApiOperation({
        summary: "This endpoint redirects user to app after google authentication"
    })
    @ApiOkResponse({
        description: 'Response on succesful google authentication',
        type: SampleResponseDTO
    })
    @Get('/google/redirect')
    @UseGuards(GoogleOAuthGuard)
    async googleAuthRedirect(@Req() req: Request): Promise<ResponseDTO> {
        return await this.userService.registerByGoogle(req.user)
    }
}
