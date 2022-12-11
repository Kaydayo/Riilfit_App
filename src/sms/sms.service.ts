import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class SmsService {
    private twilioClient: Twilio;

    constructor(
        
    ) {
        const accountSid = process.env.TWILO_ACCOUNT_SID;
        const authToken = process.env.TWILO_AUTH_TOKEN;

        this.twilioClient = new Twilio(accountSid, authToken);
    }

    initiatePhoneNumberVerification(phoneNumber: string) {
        const serviceSid = process.env.TWILIO_VERIFICATION_SERVICE_SID;

        return this.twilioClient.verify.services(serviceSid)
            .verifications
            .create({ to: phoneNumber, channel: 'sms' })
    }
}
