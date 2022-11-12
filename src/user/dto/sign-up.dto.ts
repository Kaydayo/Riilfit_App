import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class SignUpDto{
    @ApiProperty({ example: "Olarenwaju Ogunmepon" })
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    fullName: string;

    @ApiProperty({ example: "olanrewaju@ggff.com" })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: "08188441180" })
    @IsNotEmpty()
    @IsString()
    @IsPhoneNumber('NG')
    phoneNumber: string;

    @ApiProperty({ example: "nME110_t", description:"must include lower case, upper case, maxlength of 20 and min of 4" })
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password too weak' })
    password: any;
}