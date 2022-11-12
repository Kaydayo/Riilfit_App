import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Payload } from '../utils/types';

@Injectable()
export class AuthService {
    private secret: string;
    constructor(
        private userService: UserService,
         private readonly configService: ConfigService
    ) {
        const secretKey = this.configService.get<string>('secretKey')
        if (!secretKey) {
            throw new InternalServerErrorException('Environment variables missing')
        }

        this.secret = secretKey
    }

    async signPayload(payload: Payload) {
        return sign(payload, this.secret,{expiresIn:'7d'} )
        
    }
}
