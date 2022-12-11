import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schemas/user.schema';
import { HashService } from '../user/hash.service';
import { JwtStrategy } from './jwt.strategy';
import { FacebookStrategy } from './facebook.strategy';
import { GoogleStrategy } from './google.strategy';
import { Otp, OtpSchema } from '../user/schemas/otp.schema';
import { OtpService } from '../otp/otp.service';
import { MailModule } from '../mail/mail.module';
import { SmsService } from '../sms/sms.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: Otp.name, schema: OtpSchema }]),
    forwardRef(() => UserModule),
    MailModule
  ],
  providers: [AuthService,UserService, HashService, JwtStrategy, FacebookStrategy, GoogleStrategy,OtpService, SmsService],
  controllers: [AuthController],
  exports:[AuthService]
})
export class AuthModule {}
