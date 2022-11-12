import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { User, UserSchema } from './user/schemas/user.schema';
import { ConfigModule } from '@nestjs/config';
import config from './config/configuration'


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load:[config]
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    UserModule,
    AuthModule],
})
export class AppModule {}
