import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Length, Matches, MaxLength, MinLength } from "class-validator";


export class FinishResetPassowordDto {
    @ApiProperty({ example: "olanrewaju@ggff.com" })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: "1234" })
    @IsNotEmpty()
    @IsString()
    @Length(6, 6)
    otp: string;
}