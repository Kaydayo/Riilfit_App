import { Request as ExpressRequest } from 'express';
import { User } from '../user/schemas/user.schema';

export interface Request extends ExpressRequest {
    user?: Partial<User>;
}
