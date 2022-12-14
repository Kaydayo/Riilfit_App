import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import BaseService from '../service/base.service';
import { ResponseDTO } from '../utils/response.dto';
import { FinishResetPassowordDto } from './dto/finish-reset-password.dto';
import { initResetPasswordDto } from './dto/init-reset-password.dto';
import { ResetPassowordDto } from './dto/reset-password.dto';
import { UserService } from './user.service';
import { Request } from '../client/request';

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
    async finishResetPassword(@Body() payload: FinishResetPassowordDto): Promise<ResponseDTO> {
        return await this.userService.finishResetPassoword(payload)
    }

    @ApiOperation({
        summary: "finish reset password"
    })
    @ApiResponse({
        description: "reset password with otp"
    })
    @UseGuards(AuthGuard('jwt'))
    @Post('/resetPassword')
    async resetPassword(@Req() req:Request, @Body() payload: ResetPassowordDto): Promise<ResponseDTO> {
        return await this.userService.resetUserPassword(req.user.email,payload.newPassword)
    }
}
