import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';
import { RoleRepository } from 'src/repositories/role.repository';
import { RoleController } from './../controllers/role.controller';
import { RoleService } from './../services/role.service';

@Module({
    imports: [TypeOrmModule.forFeature([Role, RoleRepository])],
    controllers: [RoleController],
    providers: [RoleService, RoleRepository],
    exports: [TypeOrmModule],
})
export class RoleModule { }

