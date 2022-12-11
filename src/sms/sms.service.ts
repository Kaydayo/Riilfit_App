import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
import { AuthService } from '../auth/auth.service';
import BaseService from '../service/base.service';
import { UserService } from '../user/user.service';

@Injectable()
export class SmsService extends BaseService {
    private twilioClient: Twilio;
   

    constructor(
        @Inject(forwardRef(()=>UserService))private userService: UserService,
        private authService: AuthService
    ) {
        super()
        const accountSid = process.env.TWILO_ACCOUNT_SID;
        const authToken = process.env.TWILO_AUTH_TOKEN;

        this.twilioClient = new Twilio(accountSid, authToken);
    }

    async initiatePhoneNumberVerification(phoneNumber: string) {
       try {
           const serviceSid = process.env.TWILIO_VERIFICATION_SERVICE_SID;

           const smsSentStatus = await this.twilioClient.verify.services(serviceSid)
               .verifications
               .create({ to: phoneNumber, channel: 'sms' })

           return this.sendSuccessResponse({}, `Verification code sent to ${phoneNumber}`)
       } catch (error) {
           return this.sendFailedResponse({},"an error occurred")
       }

    }


    async confirmPhoneNumber(userEmail: string, phoneNumber: string, verificationCode: string) {
        try {
            const serviceSid = process.env.TWILIO_VERIFICATION_SERVICE_SID;

            const result = await this.twilioClient.verify.services(serviceSid)
                .verificationChecks
                .create({ to: phoneNumber, code: verificationCode })

            if (!result.valid || result.status !== 'approved') {
                return this.sendFailedResponse({}, "Wrong code provided")
            }

            const updateVerification = await this.userService.markPhoneNumberAsConfirmed(userEmail)
            console.log(updateVerification)
            if (!updateVerification) {
                return this.sendFailedResponse({}, "sorry an error occurred")
            }

            const jwtPayload = {
                email: updateVerification.email
            }

            const token = await this.authService.signPayload(jwtPayload)
            return this.sendSuccessResponse({user:updateVerification,token},"Phone number verified successfully")
        } catch (error) {
            console.log(error)
            return this.sendFailedResponse({},"an error occurred")
        }
    }
}
