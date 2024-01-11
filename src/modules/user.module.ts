import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/repositories/user.repository';
import { UserService } from './../services/user.service';
import { UserController } from './../controllers/user.controller';
import { RoleModule } from './role.module';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';
import { RoleRepository } from 'src/repositories/role.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRepository, Role, RoleRepository]),
    RoleModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule { }
