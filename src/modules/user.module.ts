import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/repositories/user.repository';
import { UserService } from './../services/user.service';
import { UserController } from './../controllers/user.controller';
import { RoleModule } from './role.module';
import { User } from 'src/entities/user.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRepository]),
    forwardRef(() => RoleModule),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, TypeOrmModule],
})
export class UserModule { }
