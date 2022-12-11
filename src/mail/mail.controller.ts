import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer'
import { EmailTemplates } from '../utils/enum';
@Controller('mail')
export class MailController {
    constructor(private mailService: MailerService) { }
    
    @Get('/plain-text-email')
    async plainTextEmail(@Body('toemail') toemail) {
        await this.mailService.sendMail({
            to: toemail,
            from: 'Onculture <onculturetest@gmail.com>',
            subject: 'Simple plain text',
            text: 'Welcome to nestjs email demo',
            html: EmailTemplates.RESETPINOTP

        });

        return 'success';
    }

    @Post('html-email')
    async postHtmlEmail(@Body() payload) {
        await this.mailService.sendMail({
            to: payload.email,
            from: 'Onculture <onculturetest@gmail.com>',
            subject: 'Simple plain text',
            template: 'invite-employee',
            context: {
                data: payload
            }

        });

        return 'success'
    }
}
