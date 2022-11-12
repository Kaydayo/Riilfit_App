import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { User, UserSchema } from './user/schemas/user.schema';
import { ConfigModule } from '@nestjs/config';

console.log(process.env.SECRET_KEY, "jjvejvff")
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost/riilfit'),
    UserModule,
    AuthModule],
})
export class AppModule {}
