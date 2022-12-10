import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Otp, OtpSchema } from '../user/schemas/otp.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: Otp.name, schema: OtpSchema }])],
  providers: [OtpService],
  controllers: [OtpController],
  exports:[OtpService]
})
export class OtpModule {}
