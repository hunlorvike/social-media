import { Module } from '@nestjs/common';
import { AuthController } from 'src/controllers/auth.controller';
import { AuthService } from 'src/services/auth.service';
import { RoleModule } from './role.module';
import { UserModule } from './user.module';
import { JwtService } from '@nestjs/jwt';
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
    ],
    exports: [AuthService],
})
export class AuthModule { }
