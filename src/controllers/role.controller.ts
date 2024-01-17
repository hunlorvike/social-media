import { Controller, Get, Post, Body, Param, Put, Delete, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { RoleDTO } from 'src/dtos/role.dto';
import { RoleModel } from 'src/models/role.model';
import { RoleService } from 'src/services/role.service';
import { BaseResponse } from 'src/response/base.response';
import { ApiTags } from '@nestjs/swagger';

@Controller('roles')
@ApiTags('Role')
export class RoleController {
    constructor(private readonly roleService: RoleService) { }


    @Get()
    async findAll(): Promise<BaseResponse<RoleModel[]>> {
        return this.roleService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<RoleModel>> {
        return this.roleService.findOne(id);
    }

    @Post()
    @UsePipes(new ValidationPipe()) 
    async create(@Body() roleDTO: RoleDTO): Promise<BaseResponse<RoleModel>> {
        return this.roleService.create(roleDTO);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe()) 
    async update(@Param('id', ParseIntPipe) id: number, @Body() roleDTO: RoleDTO): Promise<BaseResponse<RoleModel>> {
        return this.roleService.update(id, roleDTO);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<boolean>> {
        return this.roleService.remove(id);
    }

    @Get('find')
    async find(@Body() criteria: Record<string, any>): Promise<BaseResponse<RoleModel[]>> {
        return this.roleService.find(criteria);
    }

    @Get('count')
    async count(@Body() criteria: Record<string, any>): Promise<BaseResponse<number>> {
        return this.roleService.count(criteria);
    }
}
