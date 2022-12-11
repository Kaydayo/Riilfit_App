import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Length, Matches, MaxLength, MinLength } from "class-validator";


export class FinishResetPassowordDto {
    @ApiProperty({ example: "olanrewaju@ggff.com" })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: "123456" })
    @IsNotEmpty()
    @IsString()
    @Length(6, 6)
    otp: string;

    @ApiProperty({ example: "nME110_t", description: "must include lower case, upper case, maxlength of 20 and min of 4" })
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password too weak' })
    newPassword: any;
}