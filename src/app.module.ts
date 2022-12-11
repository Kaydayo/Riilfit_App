import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { User, UserSchema } from './user/schemas/user.schema';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import config from './config/configuration'
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { OtpModule } from './otp/otp.module';
import * as path from 'path';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load:[config]
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    UserModule,
    AuthModule,
    MailModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: "onculturetest@gmail.com",
          pass: "vfpolcmkzruocped"
        }
      },
      template: {
        dir: path.join(__dirname, "./templates"),
        adapter: new HandlebarsAdapter(),
        options: {
          allowProtoMethodsByDefault: true,
          allowProtoPropertiesByDefault: true,
          strict:true
        }

      }
    }),
    OtpModule
  ],
})
export class AppModule {}
