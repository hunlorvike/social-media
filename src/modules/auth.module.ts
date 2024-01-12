import { Module } from '@nestjs/common';
import { AuthController } from 'src/controllers/auth.controller';
import { AuthService } from 'src/services/auth.service';
import { RoleModule } from './role.module';
import { UserModule } from './user.module';
import { JwtService } from '@nestjs/jwt';
import { JWT_CONFIG } from 'src/configs/jwt.config';
import { UserService } from 'src/services/user.service';
import { RoleService } from 'src/services/role.service';

@Module({
    imports: [RoleModule, UserModule],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtService,
        UserService,
        RoleService,
        // Include JWT_CONFIG in the providers of AuthModule
        {
            provide: JWT_CONFIG,
            useValue: JWT_CONFIG, // assuming JWT_CONFIG is a value and not a class or factory
        },
    ],
    exports: [AuthService],
})
export class AuthModule { }
