import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';


@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/riilfit'), UserModule],
})
export class AppModule {}
