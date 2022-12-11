import { BadRequestException, forwardRef, HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from '../auth/dto/login.dto';
import { OtpService } from '../otp/otp.service';
import BaseService from '../service/base.service';
import { OtpStatus, OtpType, OtpUsage, REGISTEROPTIONS } from '../utils/enum';
import { ResponseDTO } from '../utils/response.dto';
import { FacebookPayload, GooglePayload, Payload } from '../utils/types';
import { SignUpDto } from './dto/sign-up.dto';
import { HashService } from './hash.service';
import { Otp } from './schemas/otp.schema';
import { User } from './schemas/user.schema';
import * as speakeasy from "speakeasy";
import { MailService } from '../mail/mail.service';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class UserService extends BaseService {
    private logger: Logger
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Otp.name) private otpModel: Model<Otp>,
        private hashService: HashService,
        private authService: AuthService,
        private otpService: OtpService,
        private mailService: MailService,
        private smsService:SmsService


    ) {
        super()
        this.logger = new Logger('USER SERVICE')
    }
    async updateUserData(user:Partial<User>): Promise<User>{
        return await this.userModel.findOneAndUpdate({email:user.email},user)
    }
    async create(payload: SignUpDto): Promise<ResponseDTO> {
        try {
            const { email, phoneNumber } = payload
            const user = await this.userModel.findOne({ $or: [{ email }, { phoneNumber }] }, { _id: 0, __v: 0 })

            if (user) {
                return this.sendFailedResponse({}, "email/phoneNumber already exists")
            }

            payload.password = await this.hashService.hashPassword(payload.password)
            this.logger.log(payload)
            const createdUser = new this.userModel(payload);
            await createdUser.save();

            const parsedUser = this.sanitizeUser(createdUser);



            const jwtPayload = {

                email: createdUser.email,
            };
            this.logger.log(user)

            const token = await this.authService.signPayload(jwtPayload);
            
            await this.smsService.initiatePhoneNumberVerification(parsedUser.phoneNumber)
            return this.sendSuccessResponse({ user: parsedUser, token }, `Signed up successfully, We have sent a verification code to ${parsedUser.phoneNumber}`);
        } catch (error) {
            console.log(error)
            return this.sendFailedResponse({ error: error.message }, "an error occurred")
            // return
        }
    }


    async findByLogin(payload: LoginDto): Promise<ResponseDTO> {
        try {
            const { emailPhone, password } = payload
            const user = await this.userModel.findOne({ $or: [{ email: emailPhone }, { phoneNumber: emailPhone }] }, { _id: 0, __v: 0 })
            if (!user) {
                return this.sendFailedResponse({}, 'user does not exist', 400)
            }

            if (!await this.hashService.comparePassword(password, user.password)) {
                return this.sendFailedResponse({}, 'incorrect password', 400)
            }

            const parsedUser = this.sanitizeUser(user)

            const jwtPayload = {
                email: parsedUser.email,
            };
            const token = await this.authService.signPayload(jwtPayload);
            return this.sendSuccessResponse({ user: parsedUser, token }, 'logged in successfully');

        } catch (error) {
            return this.sendFailedResponse({}, "an error occurred")
        }
    }

    async findByPayload(payload: Payload) {
        const { email } = payload;
        return await this.userModel.findOne({ email }, { _id: 0, _v: 0 });
    }

    async registerByFacebook(payload: FacebookPayload): Promise<ResponseDTO> {
        try {
            const user = await this.userModel.findOne({ email: payload.email }, { _id: 0, _v: 0 }).exec()
            if (user) {
                const parsedUser = this.sanitizeUser(user);

                const jwtPayload = {
                    email: user.email,
                };
                const token = await this.authService.signPayload(jwtPayload);
                return this.sendSuccessResponse({ user: parsedUser, token }, " facebook log in successful")
            }

            const newFacebookUser: Partial<User> = {
                email: payload.email,
                fullName: payload.firstName + ' ' + payload.lastName,
                signOn: REGISTEROPTIONS.FACEBOOK,
                socialId: payload.id,
                phoneNumber: " "
            }

            const createdUser = new this.userModel(newFacebookUser);
            await createdUser.save();

            const parsedUser = this.sanitizeUser(createdUser);

            const jwtPayload = {
                email: parsedUser.email,
            };
            this.logger.log(user)

            const token = await this.authService.signPayload(jwtPayload);
            ;
            return this.sendSuccessResponse({ user: parsedUser, token }, "facebook log in successfully");

        } catch (error) {
            return this.sendFailedResponse({}, "Facebook login unsuccessful")
        }
    }

    async registerByGoogle(payload: any): Promise<ResponseDTO> {
        try {
            const user = await this.userModel.findOne({ email: payload.email }, { _id: 0, _v: 0 }).exec()
            if (user) {
                const parsedUser = this.sanitizeUser(user);

                const jwtPayload = {
                    email: user.email,
                };
                const token = await this.authService.signPayload(jwtPayload);
                return this.sendSuccessResponse({ user: parsedUser, token }, " google log in successful")
            }

            const newGoogleUser: Partial<User> = {
                email: payload.email,
                fullName: payload.firstName + ' ' + payload.lastName,
                signOn: REGISTEROPTIONS.GOOGLE,
                socialId: payload.id,
                phoneNumber: " "
            }

            const createdUser = new this.userModel(newGoogleUser);
            await createdUser.save();

            const parsedUser = this.sanitizeUser(createdUser);

            const jwtPayload = {
                email: parsedUser.email,
            };


            const token = await this.authService.signPayload(jwtPayload);

            return this.sendSuccessResponse({ user: parsedUser, token }, "google log in successfully");
        } catch (error) {
            console.log(error)
            return this.sendFailedResponse({}, "Facebook login unsuccessful")
        }
    }


    async initResetPassword(email: string): Promise<ResponseDTO> {
        try {

            const findUserByEmail = await this.userModel.findOne({ email })
            if (!findUserByEmail) {
                return this.sendFailedResponse({}, "User does not exist")
            }
            const token = speakeasy.totp({
                secret: process.env.OTP_SECRET,
                encoding: "base32",
            });

            let updateTime: number = Date.now();

            let createDto: Otp = {
                otp: token,
                email: email,
                expiry: updateTime + 15 * 60 * 1000,
                type: OtpType.EMAIL,
                usage: OtpUsage.RESETPIN,
                status: OtpStatus.UNUSED,
            }


            let _otp = await this.otpService.createOtp(createDto)
            let _data =
                "Otp sent to registered email " +
                email +
                " " +
                "token:" +
                token;
            await this.mailService.sendOtpResetText(findUserByEmail, findUserByEmail.fullName, token)
            return this.sendSuccessResponse({}, _data)


        } catch (error) {
            return this.sendFailedResponse({error:error.message},"an error occurred")
        }
    }


    async finishResetPassoword(payload:{email:string,otp:string, newPassword:string}): Promise<ResponseDTO>{
        try {
            const findUserByEmail = await this.userModel.findOne({ email:payload.email })
            if (!findUserByEmail) {
                return this.sendFailedResponse({}, "User does not exist")
            }

            let _otp = await this.otpService.findByQuery({ email: payload.email, otp: payload.otp, status:OtpStatus.UNUSED })
            if (!_otp) {
                return this.sendFailedResponse({}, "Invalid Otp")
            }
            const tokenValidate = speakeasy.totp.verify({
                secret: process.env.OTP_SECRET,
                encoding: "base32",
                token: payload.otp,
                window: 30
            })
            if (!tokenValidate) {
                return this.sendFailedResponse({},"Invalid")
            }
            const updated = await this.otpModel.findByIdAndUpdate(_otp.id, { status: OtpStatus.USED })
            findUserByEmail.password = await this.hashService.hashPassword(payload.newPassword)
            const updatedUser = await this.updateUserData(findUserByEmail)

            const parsedUser = this.sanitizeUser(updatedUser)
            const jwtPayload = {
                email: payload.email
            }

            const token = await this.authService.signPayload(jwtPayload)
            return this.sendSuccessResponse({user:parsedUser,token},"password reset successful")
            
        } catch (error) {
            console.log(error)
            return this.sendFailedResponse({error:error.message},"an error occurred")
        }
    }

    async markPhoneNumberAsConfirmed(userEmail:any): Promise<User | undefined>{
        try {
            console.log(userEmail, "USERID")
            const findUserByEmail = await this.userModel.findOne({email:userEmail})
            if (!findUserByEmail) {
                return undefined
            }
            return await this.userModel.findOneAndUpdate({email:userEmail}, { isPhoneNumberVerified:true }, {new: true})
        } catch (error) {
            return undefined
        }
    }

    sanitizeUser(user: any) {
        const sanitized = user.toObject({ virtuals: false });
        delete sanitized['password'];
        return sanitized;
    }

}
