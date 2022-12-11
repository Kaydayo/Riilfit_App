import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { MailModule } from '../mail/mail.module';
import { OtpModule } from '../otp/otp.module';
import { Otp, OtpSchema } from '../user/schemas/otp.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { SmsController } from './sms.controller';
import { SmsService } from './sms.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: Otp.name, schema: OtpSchema }]),
    OtpModule,
    AuthModule,
    UserModule,
    MailModule
  ],
  controllers: [SmsController],
  providers: [SmsService, AuthService, UserService],
  exports:[SmsService]
})
export class SmsModule {}
