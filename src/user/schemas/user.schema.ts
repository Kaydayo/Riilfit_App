import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';
import { Document } from 'mongoose';
import { REGISTEROPTIONS, USERROLES } from '../../utils/enum';

export type UserDocument = User & Document;

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
export class User {
    id?: string;

    @Prop({ required: true })
    fullName: string;

    @Prop({ unique: true, required: true })
    @IsEmail()
    email: string;

    @Prop({ nullable: true })
    @IsOptional()
    phoneNumber: string;

    @Prop({ nullable: true })
    password: string;

    @Prop({ default: USERROLES.MEMEBER, enum: USERROLES })
    role: USERROLES

    @Prop({ defaul: REGISTEROPTIONS.APP, enum: REGISTEROPTIONS })
    signOn: REGISTEROPTIONS

    @Prop()
    socialId: string;

    @Prop({ default: false })
    isPhoneNumberVerified: boolean;

}



export const UserSchema = SchemaFactory.createForClass(User);