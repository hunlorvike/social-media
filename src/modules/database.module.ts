// src/modules/database.module.ts

import { Module, Post } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { Role } from 'src/entities/role.entity';
import { User } from 'src/entities/user.entity';


@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT, 10) || 3306,
            username: process.env.DB_USERNAME || 'root',
            password: '',
            database: process.env.DB_DATABASE || 'nestjs_social',
            entities: [User, Role, Post],
            synchronize: true,
        }),
        TypeOrmModule.forFeature([User, Role]),
    ],
})
export class DatabaseModule { }
