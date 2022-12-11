import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import BaseService from '../service/base.service';
import { Otp } from '../user/schemas/otp.schema';

@Injectable()
export class OtpService extends BaseService {
    constructor(@InjectModel(Otp.name) private otpModel: Model<Otp>,) {
        super()
    }

    async findOneByEmail(userEmail:string):Promise<any> {
       return await this.otpModel.find({email:userEmail})
    }
    
    async createOtp(payload: Otp): Promise<any>{
        return await this.otpModel.create(payload)
    }

    async findByQuery(query:any): Promise<any>{
        return await this.otpModel.findOne(query)
    }


    
}
