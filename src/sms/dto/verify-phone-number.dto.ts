import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Length, Matches, MaxLength, MinLength } from "class-validator";


export class CheckVerificationCodeDto {
    @ApiProperty({ example: "1234" })
    @IsNotEmpty()
    @IsString()
    @Length(4, 4)
    code: string;
}