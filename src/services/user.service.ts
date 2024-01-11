import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CrudService } from './crud.service';
import { User } from 'src/entities/user.entity';
import { UserModel } from 'src/models/user.model';
import { UserDTO } from 'src/dtos/user.dto';
import { Repository, getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { validateOrReject } from 'class-validator';
import { BaseResponse } from 'src/response/base.response';
import { Role } from 'src/entities/role.entity';

@Injectable()
export class UserService implements CrudService<User, UserModel, UserDTO> {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,) {

    }

    async create(data: UserDTO): Promise<BaseResponse<UserModel>> {
        try {
            // Convert from DTO to Entity
            const newUser = this.dtoToEntity(data);

            // Validate the Entity
            await validateOrReject(newUser);

            const roleName = 'User';

            // Find or create the role
            let userRole = await this.roleRepository.findOne({ where: { roleName } });

            if (!userRole) {
                // If role doesn't exist, create and save it
                userRole = await this.roleRepository.create({ roleName });
                userRole = await this.roleRepository.save(userRole);
            }

            // Assign role to the user
            newUser.roles = [userRole];

            // Save the user to the database
            const savedUser = await this.userRepository.save(newUser);

            // Manually synchronize the users_roles table
            await this.userRepository
                .createQueryBuilder()
                .relation(User, "roles")
                .of(savedUser)
                .add(userRole);

            return BaseResponse.success<UserModel>('User created successfully', this.entityToModel(savedUser));
        } catch (error) {
            console.error('Error creating user:', error);
            if (error instanceof HttpException) {
                // Xử lý các HttpException
                return BaseResponse.error<UserModel>(error.getStatus(), error.message, 'Internal Server Error');
            } else if (error.code === '23505') {
                // Xử lý trường hợp trùng lặp (unique constraint violation)
                return BaseResponse.error<UserModel>(HttpStatus.CONFLICT, 'User with this email or phone already exists', 'Internal Server Error');
            } else {
                // Xử lý các loại exception khác
                return BaseResponse.error<UserModel>(HttpStatus.INTERNAL_SERVER_ERROR, 'Could not create user', 'Internal Server Error');
            }
        }
    }

    async findAll(): Promise<BaseResponse<UserModel[]>> {
        try {
            const users = await this.userRepository
                .createQueryBuilder('user')
                .leftJoinAndSelect('user.roles', 'roles')
                .getMany();

            const userModels = users.map((user) => this.entityToModel(user));

            return BaseResponse.success<UserModel[]>('Users retrieved successfully', userModels);
        } catch (error) {
            console.error('Error retrieving users:', error);
            return BaseResponse.error<UserModel[]>(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Could not retrieve users',
                error.message || 'Internal Server Error',
            );
        }
    }


    async findOne(id: number): Promise<BaseResponse<UserModel>> {
        try {
            const user = await this.userRepository
                .createQueryBuilder('user')
                .leftJoinAndSelect('user.roles', 'roles')
                .where('user.id = :id', { id })
                .getOne();

            if (!user) {
                throw new HttpException(`User with id ${id} not found`, HttpStatus.NOT_FOUND);
            }

            return BaseResponse.success<UserModel>('User retrieved successfully', this.entityToModel(user));
        } catch (error) {
            console.error('Error retrieving user:', error);
            return BaseResponse.error<UserModel>(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Could not retrieve user',
                error.message || 'Internal Server Error',
            );
        }
    }


    async update(id: number, data: UserDTO): Promise<BaseResponse<UserModel>> {
        try {
            const updatedUser = await this.userRepository.findOne({ where: { id } });

            if (!updatedUser) {
                throw new HttpException(`User with id ${id} not found after update`, HttpStatus.NOT_FOUND);
            }

            await this.userRepository.update(id, data);

            return BaseResponse.success<UserModel>('User updated successfully', this.entityToModel(updatedUser));
        } catch (error) {
            console.error('Error updating user:', error);
            if (error instanceof HttpException) {
                return BaseResponse.error<UserModel>(error.getStatus(), error.message, 'Internal Server Error');
            } else {
                return BaseResponse.error<UserModel>(HttpStatus.INTERNAL_SERVER_ERROR, 'Could not update user', 'Internal Server Error');
            }
        }
    }


    async remove(id: number): Promise<BaseResponse<boolean>> {
        try {
            const user = await this.userRepository.findOne({ where: { id } });

            if (!user) {
                throw new HttpException(`User with id ${id} not found`, HttpStatus.NOT_FOUND);
            }

            await this.userRepository.remove(user);
            return BaseResponse.success<boolean>('User removed successfully', true);
        } catch (error) {
            console.error('Error removing user:', error);
            if (error instanceof HttpException) {
                return BaseResponse.error<boolean>(error.getStatus(), error.message, 'Internal Server Error');
            } else {
                return BaseResponse.error<boolean>(HttpStatus.INTERNAL_SERVER_ERROR, 'Could not remove user', 'Internal Server Error');
            }

        }
    }

    async find(criteria: Record<string, any>): Promise<BaseResponse<UserModel[]>> {
        try {
            const users = await this.userRepository.find(criteria);
            const userModels = users.map((user) => this.entityToModel(user));
            return BaseResponse.success<UserModel[]>('Users found successfully', userModels);
        } catch (error) {
            console.error('Error finding users:', error);
            return BaseResponse.error<UserModel[]>(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Could not find users',
                error.message || 'Internal Server Error',
            );
        }
    }

    async count(criteria: Record<string, any>): Promise<BaseResponse<number>> {
        try {
            const count = await this.userRepository.count(criteria);
            return BaseResponse.success<number>('Users counted successfully', count);
        } catch (error) {
            console.error('Error counting users:', error);
            return BaseResponse.error<number>(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Could not count users',
                error.message || 'Internal Server Error',
            );
        }
    }

    entityToModel(entity: User): UserModel {
        const { id, fullName, gender, email, phone, password, refreshToken, createdAt, updatedAt, roles } = entity;
        return new UserModel(id, fullName, gender, email, phone, password, refreshToken, createdAt, updatedAt, roles);
    }

    dtoToEntity(dto: UserDTO): User {
        const user = new User();
        user.fullName = dto.fullName;
        user.gender = dto.gender;
        user.email = dto.email;
        user.phone = dto.phone;
        user.password = dto.password;
        user.refreshToken = dto.refreshToken;

        return user;
    }
}
