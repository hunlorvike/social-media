import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { UserDTO } from 'src/dtos/user.dto';
import { UserModel } from 'src/models/user.model';
import { UserService } from 'src/services/user.service';
import { BaseResponse } from 'src/response/base.response';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('User')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    async create(@Body() userDTO: UserDTO): Promise<BaseResponse<UserModel>> {
        return this.userService.create(userDTO);
    }

    @Get()
    async findAll(): Promise<BaseResponse<UserModel[]>> {
        return this.userService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<BaseResponse<UserModel>> {
        return this.userService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() userDTO: UserDTO): Promise<BaseResponse<UserModel>> {
        return this.userService.update(id, userDTO);
    }

    @Delete(':id')
    async remove(@Param('id') id: number): Promise<BaseResponse<boolean>> {
        return this.userService.remove(id);
    }

    @Get('find')
    async find(@Query() criteria: Record<string, any>): Promise<BaseResponse<UserModel[]>> {
        return this.userService.find(criteria);
    }

    @Get('count')
    async count(@Query() criteria: Record<string, any>): Promise<BaseResponse<number>> {
        return this.userService.count(criteria);
    }
}
