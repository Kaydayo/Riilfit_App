import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class initResetPasswordDto {
    @ApiProperty({ example: "olanrewaju@ggff.com" })
    @IsNotEmpty()
    @IsEmail()
    email: string;
}