import { Injectable, ConflictException, HttpException, HttpStatus } from '@nestjs/common';
import { CrudService } from './crud.service';
import { Role } from 'src/entities/role.entity';
import { RoleModel } from 'src/models/role.model';
import { RoleDTO } from 'src/dtos/role.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseResponse } from 'src/response/base.response';

@Injectable()
export class RoleService implements CrudService<Role, RoleModel, RoleDTO> {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) { }

    async create(data: RoleDTO): Promise<BaseResponse<RoleModel>> {
        try {
            const existingRole = await this.roleRepository.findOne({
                where: { roleName: data.roleName },
            });

            if (existingRole) {
                return BaseResponse.error<RoleModel>(
                    HttpStatus.CONFLICT,
                    'Role with this name already exists',
                    'Internal Server Error',
                );
            }

            const roleEntity = this.dtoToEntity(data);

            const newRole = await this.roleRepository.save(roleEntity);

            return BaseResponse.success<RoleModel>('Role created successfully', this.entityToModel(newRole));
        } catch (error) {
            console.error('Error creating role:', error);
            return BaseResponse.error<RoleModel>(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Could not create role',
                'Internal Server Error',
            );
        }
    }

    async findAll(): Promise<BaseResponse<RoleModel[]>> {
        try {
            const roles = await this.roleRepository.find();
            const roleModels = roles.map((role) => this.entityToModel(role));
            return BaseResponse.success<RoleModel[]>('Roles retrieved successfully', roleModels);
        } catch (error) {
            console.error('Error retrieving roles:', error);
            return BaseResponse.error<RoleModel[]>(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Could not retrieve roles',
                'Internal Server Error',
            );
        }
    }

    async findOne(id: number): Promise<BaseResponse<RoleModel>> {
        try {
            const role = await this.roleRepository.findOne({ where: { id } });
            if (!role) {
                return BaseResponse.error<RoleModel>(
                    HttpStatus.NOT_FOUND,
                    `Role with id ${id} not found`,
                    'Internal Server Error',
                );
            }
            return BaseResponse.success<RoleModel>('Role retrieved successfully', this.entityToModel(role));
        } catch (error) {
            console.error('Error retrieving role:', error);
            return BaseResponse.error<RoleModel>(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Could not retrieve role',
                'Internal Server Error',
            );
        }
    }

    async update(id: number, data: RoleDTO): Promise<BaseResponse<RoleModel>> {
        try {
            const updatedRole = await this.roleRepository.findOne({ where: { id } });

            if (!updatedRole) {
                return BaseResponse.error<RoleModel>(
                    HttpStatus.NOT_FOUND,
                    `Role with id ${id} not found`,
                    'Internal Server Error',
                );
            }

            await this.roleRepository.update(id, data);

            return BaseResponse.success<RoleModel>('Role updated successfully', this.entityToModel(updatedRole));
        } catch (error) {
            console.error('Error updating role:', error);
            return BaseResponse.error<RoleModel>(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Could not update role',
                'Internal Server Error',
            );
        }
    }

    async remove(id: number): Promise<BaseResponse<boolean>> {
        try {
            const role = await this.roleRepository.findOne({ where: { id } });
            if (!role) {
                return BaseResponse.error<boolean>(
                    HttpStatus.NOT_FOUND,
                    `Role with id ${id} not found`,
                    'Internal Server Error',
                );
            }
            await this.roleRepository.remove(role);
            return BaseResponse.success<boolean>('Role removed successfully', true);
        } catch (error) {
            console.error('Error removing role:', error);
            return BaseResponse.error<boolean>(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Could not remove role',
                'Internal Server Error',
            );
        }
    }

    async find(criteria: Record<string, any>): Promise<BaseResponse<RoleModel[]>> {
        try {
            const roles = await this.roleRepository.find(criteria);
            const roleModels = roles.map((role) => this.entityToModel(role));
            return BaseResponse.success<RoleModel[]>('Roles found successfully', roleModels);
        } catch (error) {
            console.error('Error finding roles:', error);
            return BaseResponse.error<RoleModel[]>(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Could not find roles',
                'Internal Server Error',
            );
        }
    }

    async count(criteria: Record<string, any>): Promise<BaseResponse<number>> {
        try {
            const count = await this.roleRepository.count(criteria);
            return BaseResponse.success<number>('Roles counted successfully', count);
        } catch (error) {
            console.error('Error counting roles:', error);
            return BaseResponse.error<number>(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Could not count roles',
                'Internal Server Error',
            );
        }
    }

    entityToModel(entity: Role): RoleModel {
        return new RoleModel(entity.id, entity.roleName);
    }

    dtoToEntity(dto: RoleDTO): Role {
        const role = new Role();
        role.roleName = dto.roleName;
        return role;
    }
}
