import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class LoginDto {
    @IsNotEmpty()
    @IsString()
    emailPhone: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}