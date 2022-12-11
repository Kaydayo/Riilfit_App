import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import BaseService from '../service/base.service';
import { ResponseDTO } from '../utils/response.dto';
import { initResetPasswordDto } from './dto/init-reset-password.dto';
import { UserService } from './user.service';


@ApiTags('user')
@Controller('user')
export class UserController extends BaseService {
    private logger: Logger = new Logger("USER CONTROLLER")
    constructor(
        private userService:UserService
    ) {
        super()
    }

    @ApiOperation({
        summary:"Initiate reset password"
    })
    @ApiResponse({
        description:"sends otp to user email"
    })
    @Post('/initResetPassword')
    async initResetPassword(@Body() payload: initResetPasswordDto): Promise<ResponseDTO>{
        return await this.userService.initResetPassword(payload.email)
    }

    @ApiOperation({
        summary: "finish reset password"
    })
    @ApiResponse({
        description: "reset password with otp"
    })
    @Post('/finishResetPassword')
    async finishResetPassword(@Body() payload: { email: string, otp: string, newPassword:string }): Promise<ResponseDTO> {
        return await this.userService.finishResetPassoword(payload)
    }
}
