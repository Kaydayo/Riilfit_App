import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import BaseService from '../service/base.service';
import { EmailSubject, EmailTemplates } from '../utils/enum';
import { ResponseDTO } from '../utils/response.dto';

@Injectable()
export class MailService extends BaseService {
    private readonly fromEmail = process.env.FROM_EMAIL
    constructor(private mailService: MailerService) {
        super()
    }

    async sendOtpResetHtml(payload: any, name: string, otp:string): Promise<ResponseDTO> {
        try {
            payload.name = name
            payload.otp = otp
            const newPayload = { ...payload }
            const checkMailStatus = await this.mailService.sendMail({
                to: payload.email,
                from: this.fromEmail,
                subject: EmailSubject.RESETPINOTP,
                template: EmailTemplates.RESETPINOTP,
                context: {
                    data: newPayload
                },
            })
            return this.sendSuccessResponse({}, 'success')
        } catch (error) {

        }

    }

    async sendOtpResetText(payload: any, name: string, otp: string): Promise<ResponseDTO>{
        try {
            payload.name = name
            payload.otp = otp
            const newPayload = { ...payload }
            const checkMailStatus = await this.mailService.sendMail({
                to: payload.email,
                from: this.fromEmail,
                subject: EmailSubject.RESETPINOTP,
                text: `Kindly reset pin with these code ${otp}`,
                html: `<p>Kindly reset pin with these code ${otp}</p>`
            })
            console.log(checkMailStatus)
            return this.sendSuccessResponse({}, 'success')
        } catch (error) {
            console.log("FROM HERE",error)
        }
    }

}
