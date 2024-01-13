import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from 'src/controllers/auth.controller';
import { AuthService } from 'src/services/auth.service';
import { RoleModule } from './role.module';
import { UserModule } from './user.module';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/services/user.service';
import { RoleService } from 'src/services/role.service';

@Module({
  imports: [forwardRef(() => RoleModule), forwardRef(() => UserModule)],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    UserService,
    RoleService,
  ],
  exports: [AuthService],
})
export class AuthModule {

}

// Sử dụng forwardRef trong imports của các module để giải quyết vòng lặp.
