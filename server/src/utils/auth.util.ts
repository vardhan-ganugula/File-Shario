import jwt, { type SignOptions } from 'jsonwebtoken'; 
import { JWT_SECRET, JWT_EXPIRES_IN } from '@utils/config.util.js';
import type { JWTPayload } from '@interfaces/auth.interface.js';
import type { StringValue } from "ms";

export const generateToken = (payload: JWTPayload) => {
    const options: SignOptions = {
        expiresIn: JWT_EXPIRES_IN as StringValue,
    };

    return jwt.sign(payload, JWT_SECRET, options);
};

