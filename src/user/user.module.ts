import { Global, Module } from '@nestjs/common';
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


@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema },{name:Otp.name, schema:OtpSchema}]),
    AuthModule
  ],
  providers: [UserService, HashService, AuthService,ConfigService],
  controllers: [UserController],
  exports:[UserService, HashService]
})
export class UserModule {}
