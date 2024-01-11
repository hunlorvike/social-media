import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { RoleDTO } from 'src/dtos/role.dto';
import { RoleModel } from 'src/models/role.model';
import { RoleService } from 'src/services/role.service';
import { BaseResponse } from 'src/response/base.response';

@Controller('roles')
export class RoleController {
    constructor(private readonly roleService: RoleService) { }

    @Post()
    async create(@Body() roleDTO: RoleDTO): Promise<BaseResponse<RoleModel>> {
        return this.roleService.create(roleDTO);
    }

    @Get()
    async findAll(): Promise<BaseResponse<RoleModel[]>> {
        return this.roleService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<BaseResponse<RoleModel>> {
        return this.roleService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() roleDTO: RoleDTO): Promise<BaseResponse<RoleModel>> {
        return this.roleService.update(id, roleDTO);
    }

    @Delete(':id')
    async remove(@Param('id') id: number): Promise<BaseResponse<boolean>> {
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
