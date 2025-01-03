import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';
import { RoleRepository } from 'src/repositories/role.repository';
import { RoleController } from './../controllers/role.controller';
import { RoleService } from './../services/role.service';
import { UserModule } from './user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, RoleRepository]),
    forwardRef(() => UserModule)
  ],
  controllers: [RoleController],
  providers: [RoleService, RoleRepository],
  exports: [RoleService, TypeOrmModule],
})
export class RoleModule {

}

