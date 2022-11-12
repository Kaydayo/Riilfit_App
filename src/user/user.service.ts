import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import BaseService from '../service/base.service';
import { ResponseDTO } from '../utils/response.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService extends BaseService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>
    ) {
        super()
    }

    async create(payload: SignUpDto): Promise<ResponseDTO>{
        try {
            const { email, phoneNumber } = payload
            const user = await this.userModel.findOne({ email, phoneNumber })
            
            if (user) {
                throw new HttpException('email/phoneNumber already exists', HttpStatus.BAD_REQUEST);
            }

            const createdUser = new this.userModel(payload);
            await createdUser.save();

            return this.sanitizeUser(createdUser);
        } catch (error) {
            return this.sendFailedResponse({}, error.message)
        }
    }






    sanitizeUser(user: any) {
        const sanitized = user.toObject();
        delete sanitized['password'];
        return sanitized;
    }

}
