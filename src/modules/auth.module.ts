import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from 'src/controllers/auth.controller';
import { AuthService } from 'src/services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { UserRepository } from 'src/repositories/user.repository';
import { RoleRepository } from 'src/repositories/role.repository';
import { RoleModule } from './role.module';
import { UserModule } from './user.module';

@Module({
    imports: [
        RoleModule,
        UserModule
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [],
})
export class AuthModule { }
