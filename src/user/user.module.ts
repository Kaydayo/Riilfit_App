import { forwardRef, Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { HashService } from './hash.service';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { Otp, OtpSchema } from './schemas/otp.schema';
import { OtpService } from '../otp/otp.service';
import { MailModule } from '../mail/mail.module';
import { SmsModule } from '../sms/sms.module';
import { SmsService } from '../sms/sms.service';


@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: Otp.name, schema: OtpSchema }]),
    AuthModule,
    MailModule,
    SmsModule,
  ],
  providers: [UserService, HashService, AuthService, ConfigService, OtpService],
  controllers: [UserController],
  exports: [UserService, HashService]
})
export class UserModule { }
