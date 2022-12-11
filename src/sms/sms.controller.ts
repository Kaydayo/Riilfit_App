import { BadRequestException, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SmsService } from './sms.service';
import { Request } from '../client/request';

@Controller('sms')
export class SmsController {
    constructor(
        private readonly smsService: SmsService
    ) { }

    @Post('initiate-verification')
    @UseGuards(AuthGuard('jwt'))
    async initiatePhoneNumberVerification(@Req() req: Request) {
        if (req.user.isPhoneNumberVerified) {
            throw new BadRequestException('Phone number already confirmed');
        }
        await this.smsService.initiatePhoneNumberVerification(req.user.phoneNumber);
    }
}
