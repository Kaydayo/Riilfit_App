import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Length, Matches, MaxLength, MinLength } from "class-validator";


export class CheckVerificationCodeDto {
    @ApiProperty({ example: "123456" })
    @IsNotEmpty()
    @IsString()
    @Length(6, 6)
    code: string;
}