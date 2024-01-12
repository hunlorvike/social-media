// src/config/jwt.config.ts
import { registerAs } from '@nestjs/config';

export class JwtConfig {
    static secret = process.env.JWT_SECRET || 'defaultSecret';
    static accessTokenTtl = process.env.JWT_ACCESS_TOKEN_TTL || '3600s';

    static get() {
        return {
            secret: JwtConfig.secret,
            accessTokenTtl: JwtConfig.accessTokenTtl,
        };
    }
}

export const JWT_CONFIG = 'JWT_CONFIG';
export default registerAs('jwt', () => JwtConfig);

