import { PostController } from './../controllers/post.controller';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { PostRepository } from 'src/repositories/post.repository';
import { UserModule } from './user.module';
import { PostService } from 'src/services/post.service';
import { RoleModule } from './role.module';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forFeature([Post, PostRepository]),
        forwardRef(() => UserModule),
        forwardRef(() => RoleModule),
    ],
    controllers: [PostController],
    providers: [PostService, PostRepository, JwtService],
    exports: [PostService, TypeOrmModule],
})
export class PostModule { }


