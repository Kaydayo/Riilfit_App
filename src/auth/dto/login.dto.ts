import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class LoginDto {
    @ApiProperty({example:"olanrewaju@ggf.com or  08188441189"})
    @IsNotEmpty()
    @IsString()
    emailPhone: string;

    @ApiProperty({example:"eeek2234_R"})
    @IsNotEmpty()
    @IsString()
    password: string;
}