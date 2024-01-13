import { Injectable } from "@nestjs/common";
import { PostDTO } from "src/dtos/post.dto";
import { Post } from "src/entities/post.entity";
import { PostModel } from "src/models/post.model";
import { CrudService } from "./crud.service";
import { BaseResponse } from "src/response/base.response";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { User } from "src/entities/user.entity";

@Injectable()
export class PostService implements CrudService<Post, PostModel, PostDTO>{
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    create(data: PostDTO): Promise<BaseResponse<number | boolean | PostModel | PostModel[]>> {
        throw new Error("Method not implemented.");
    }
    findAll(): Promise<BaseResponse<number | boolean | PostModel | PostModel[]>> {
        throw new Error("Method not implemented.");
    }
    findOne(id: number): Promise<BaseResponse<number | boolean | PostModel | PostModel[]>> {
        throw new Error("Method not implemented.");
    }
    update(id: number, data: PostDTO): Promise<BaseResponse<number | boolean | PostModel | PostModel[]>> {
        throw new Error("Method not implemented.");
    }
    remove(id: number): Promise<BaseResponse<number | boolean | PostModel | PostModel[]>> {
        throw new Error("Method not implemented.");
    }
    find(criteria: Record<string, any>): Promise<BaseResponse<number | boolean | PostModel | PostModel[]>> {
        throw new Error("Method not implemented.");
    }
    count(criteria: Record<string, any>): Promise<BaseResponse<number | boolean | PostModel | PostModel[]>> {
        throw new Error("Method not implemented.");
    }
    entityToModel(entity: Post): PostModel {
        throw new Error("Method not implemented.");
    }
    dtoToEntity(dto: PostDTO): Post {
        throw new Error("Method not implemented.");
    }

}