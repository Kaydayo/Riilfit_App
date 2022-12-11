import { BadRequestException, Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SmsService } from './sms.service';
import { Request } from '../client/request';
import BaseService from '../service/base.service';
import { CheckVerificationCodeDto } from './dto/verify-phone-number.dto';

@Controller('sms')
export class SmsController extends BaseService {
    constructor(
        private readonly smsService: SmsService
    ) {
        super()
     }

    @Post('initiate-verification')
    @UseGuards(AuthGuard('jwt'))
    async initiatePhoneNumberVerification(@Req() req: Request) {
        if (req.user.isPhoneNumberVerified) {
            throw new BadRequestException('Phone number already confirmed');
        }
        
        await this.smsService.initiatePhoneNumberVerification(req.user.phoneNumber);
    }

    @Post('check-verification-code')
    @UseGuards(AuthGuard('jwt'))
    async checkVerificationCode(@Req() request: Request, @Body() verificationData: CheckVerificationCodeDto) {
        if (request.user.isPhoneNumberVerified) {
            return this.sendFailedResponse({},"Phone number already verified")
        }
       return await this.smsService.confirmPhoneNumber(request.user.email, request.user.phoneNumber, verificationData.code);
    }


    
}
