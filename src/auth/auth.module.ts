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

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: Otp.name, schema: OtpSchema }]),
    forwardRef(() => UserModule)
  ],
  providers: [AuthService,UserService, HashService, JwtStrategy, FacebookStrategy, GoogleStrategy,OtpService],
  controllers: [AuthController],
  exports:[AuthService]
})
export class AuthModule {}
