import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsPhoneNumber } from 'class-validator';
import { Document } from 'mongoose';
import { USERROLES } from '../../utils/enum';

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
    @Prop({ required: true })
    fullName: string;

    @Prop({ unique: true })
    @IsEmail()
    email: string;

    @Prop({ unique: true })
    @IsPhoneNumber('NG')
    phoneNumber: string;

    @Prop({ required: true })
    password: string;

    @Prop({default: USERROLES.MEMEBER,enum: USERROLES})
    role:USERROLES
  
}



export const UserSchema = SchemaFactory.createForClass(User);