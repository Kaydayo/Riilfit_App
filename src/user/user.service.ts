import { BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from '../auth/dto/login.dto';
import BaseService from '../service/base.service';
import { ResponseDTO } from '../utils/response.dto';
import { Payload } from '../utils/types';
import { SignUpDto } from './dto/sign-up.dto';
import { HashService } from './hash.service';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService extends BaseService {
    private logger: Logger 
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly configService: ConfigService,
        private hashService: HashService,
        private authService: AuthService
    ) {
        super()
        this.logger =  new Logger('USER SERVICE')
    }

    async create(payload: SignUpDto): Promise<ResponseDTO> {
        try {
            const { email, phoneNumber } = payload
            const user = await this.userModel.findOne({ $or: [{ email }, { phoneNumber }] }, { _id: 0, __v: 0 })

            if (user) {
                return this.sendFailedResponse({},"email/phoneNumber already exists")
            }
        
            payload.password = await this.hashService.hashPassword(payload.password)
            this.logger.log(payload)
            const createdUser = new this.userModel(payload);
            await createdUser.save();

            const parsedUser = this.sanitizeUser(createdUser);


            
            const jwtPayload = {

                email: user.email,
            };
            this.logger.log(user)

            const token = await this.authService.signPayload(jwtPayload);
            ;
            return this.sendSuccessResponse({ user: user, token  }, "signed up successfully");
        } catch (error) {
            return this.sendFailedResponse({}, "an error occurred")
            // return
        }
    }


    async findByLogin(payload: LoginDto): Promise<ResponseDTO>{
        try {
            const { emailPhone, password } = payload
            const user = await this.userModel.findOne({ $or: [{ email: emailPhone }, { phoneNumber: emailPhone }] }, { _id: 0, __v: 0 })
            if (!user) {
                return this.sendFailedResponse({},'user does not exist', 400)
            }

            if (!await this.hashService.comparePassword(password, user.password)) {
                return this.sendFailedResponse({}, 'incorrect password', 400)
            }

            const parsedUser =  this.sanitizeUser(user)

            const jwtPayload = {
                email: parsedUser.email,
            };
            const token = await this.authService.signPayload(jwtPayload);
            return this.sendSuccessResponse({ user:parsedUser, token },'logged in successfully');

        } catch (error) {
            return this.sendFailedResponse({},"an error occurred")
        }
    }

    async findByPayload(payload: Payload) {
        const { email } = payload;
        return await this.userModel.findOne({ email },{_id:0,_v:0});
    }




    sanitizeUser(user: any) {
        const sanitized = user.toObject({virtuals:false});
        delete sanitized['password'];
        return sanitized;
    }

}
