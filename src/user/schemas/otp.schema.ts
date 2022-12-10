import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsOptional, IsPhoneNumber, Length } from 'class-validator';
import { Document } from 'mongoose';
import { REGISTEROPTIONS, USERROLES } from '../../utils/enum';

export type OtpDocument = Otp & Document;

@Schema({
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform(doc, ret) {
            delete ret._id;
            delete ret._v
        }
    },
    toObject: {
        virtuals: true,
        transform(doc, ret) {
            doc.id = ret._id;
        }
    }
})
export class Otp {
    @Prop({ required: true })
    @IsEmail()
    email: string;

    @Prop({ required: true })
    otp: string;

    @Prop({ required: true })
    type: string;

    @Prop()
    usage: string;

    @Prop()
    expiry: number;

    @Prop()
    status: string;
}



export const OtpSchema = SchemaFactory.createForClass(Otp);