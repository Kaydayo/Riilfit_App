import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { User } from "../../user/schemas/user.schema";
import { REGISTEROPTIONS } from "../../utils/enum";

export class SampleUserDTO {
    @ApiProperty({example:"Olanrewaju ogunmepon"})
    fullName: string;

    @ApiProperty({ example: "olanrewaju@ggf.com" })
    email: string;

    @ApiProperty({ example: "08188441190" })
    phoneNumber: string;

    @ApiProperty({ example: "member" })
    role: string;

    @ApiProperty({  enum:REGISTEROPTIONS })
    signOn: REGISTEROPTIONS;

}

export class SamplePayloadDTO {
    @ApiProperty()
    @IsNotEmpty()
    user: SampleUserDTO;

    @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im9sdWtheW9kZWRheW8xMDBAZ21" })
    @IsNotEmpty()
    token: string;
}

export class SampleResponseDTO {
    @ApiProperty({ example: true })
    @IsNotEmpty()
    @IsBoolean()
    statusCode: boolean;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    payload: SamplePayloadDTO;

    @ApiProperty({ example: "successful" })
    @IsNotEmpty()
    message: string;
}


