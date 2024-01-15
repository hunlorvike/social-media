import { HttpStatus, Injectable } from "@nestjs/common";
import { PostDTO } from "src/dtos/post.dto";
import { Post } from "src/entities/post.entity";
import { PostModel } from "src/models/post.model";
import { CrudService } from "./crud.service";
import { BaseResponse } from "src/response/base.response";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from 'typeorm';
import { User } from "src/entities/user.entity";
import { validateOrReject } from "class-validator";
import * as ExcelJS from 'exceljs';
@Injectable()
export class PostService implements CrudService<Post, PostModel, PostDTO> {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }


    async create(data: PostDTO): Promise<BaseResponse<number | boolean | PostModel | PostModel[]>> {
        try {
            const newPost = await this.dtoToEntity(data);

            await validateOrReject(newPost);

            const createdPost = await this.postRepository.save(newPost);

            return BaseResponse.success<PostModel>('Post created successfully', await this.entityToModel(createdPost));
        } catch (error) {
            console.error('Error creating post:', error);
            return BaseResponse.error<PostModel>(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Could not create post',
                'Internal Server Error',
            );
        }
    }

    async findAll(): Promise<BaseResponse<PostModel[]>> {
        try {
            const posts = await this.postRepository.find();
            const postModels = await Promise.all(posts.map(post => this.entityToModel(post)));
            return BaseResponse.success<PostModel[]>('Posts retrieved successfully', postModels);
        } catch (error) {
            console.error('Error retrieving posts:', error);
            return BaseResponse.error<PostModel[]>(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Could not retrieve posts',
                'Internal Server Error',
            );
        }
    }


    // Add this method to your PostService
    async findAllByAuthor(authorId: number): Promise<BaseResponse<PostModel[]>> {
        try {
            const posts = await this.postRepository.find({
                where: { author: { id: authorId } },
            });

            if (!posts || posts.length === 0) {
                return BaseResponse.error<PostModel[]>(
                    HttpStatus.NOT_FOUND,
                    `No posts found for author with id ${authorId}`,
                    'Not Found',
                );
            }

            const postModels = await Promise.all(posts.map(post => this.entityToModel(post)));
            return BaseResponse.success<PostModel[]>('Posts retrieved successfully', postModels);
        } catch (error) {
            console.error('Error retrieving posts by author:', error);
            return BaseResponse.error<PostModel[]>(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Could not retrieve posts by author',
                'Internal Server Error',
            );
        }
    }


    async findOne(id: number): Promise<BaseResponse<PostModel>> {
        try {
            const post = await this.postRepository.findOne({ where: { id } });
            if (!post) {
                return BaseResponse.error<PostModel>(
                    HttpStatus.NOT_FOUND,
                    `Post with id ${id} not found`,
                    'Internal Server Error',
                );
            }
            return BaseResponse.success<PostModel>('Post retrieved successfully', await this.entityToModel(post));
        } catch (error) {
            console.error('Error retrieving post:', error);
            return BaseResponse.error<PostModel>(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Could not retrieve post',
                'Internal Server Error',
            );
        }
    }

    async update(id: number, data: PostDTO): Promise<BaseResponse<PostModel>> {
        try {
            const updatedPost = await this.postRepository.findOne({
                where: { id },
                relations: ['author'],
            });

            if (!updatedPost) {
                return BaseResponse.error<PostModel>(
                    HttpStatus.NOT_FOUND,
                    `Post with id ${id} not found`,
                    'Internal Server Error',
                );
            }

            // Check if authorId in the data is different from the authorId in the database
            if (data.authorId && data.authorId !== updatedPost.author.id) {
                // If different, return an error (or handle the conflict as needed)
                return BaseResponse.error<PostModel>(
                    HttpStatus.BAD_REQUEST,
                    'Cannot update authorId',
                    'Invalid Request',
                );
            }

            // Exclude 'authorId' from the update data
            const { authorId, ...updateData } = data;

            // Update only if there are fields to update
            if (Object.keys(updateData).length > 0) {
                const updatedPostEntity = await this.postRepository.save({
                    ...updatedPost,
                    ...updateData,
                });

                return BaseResponse.success<PostModel>('Post updated successfully', await this.entityToModel(updatedPostEntity));
            }

            return BaseResponse.success<PostModel>('No fields to update', await this.entityToModel(updatedPost));
        } catch (error) {
            console.error('Error updating post:', error);
            return BaseResponse.error<PostModel>(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Could not update post',
                'Internal Server Error',
            );
        }
    }

    async removeByAuthor(id: number, userId: number): Promise<BaseResponse<boolean>> {
        try {
            const post = await this.postRepository.findOne({ where: { id } });

            if (!post) {
                return BaseResponse.error<boolean>(
                    HttpStatus.NOT_FOUND,
                    `Post with id ${id} not found`,
                    'Internal Server Error',
                );
            }

            if (post.author.id !== userId) {
                return BaseResponse.error<boolean>(
                    HttpStatus.FORBIDDEN,
                    'You are not authorized to remove this post',
                    'Forbidden',
                );
            }

            await this.postRepository.remove(post);

            return BaseResponse.success<boolean>('Post removed successfully', true);
        } catch (error) {
            console.error('Error removing post:', error);
            return BaseResponse.error<boolean>(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Could not remove post',
                'Internal Server Error',
            );
        }
    }


    async remove(id: number): Promise<BaseResponse<boolean>> {
        try {
            const post = await this.postRepository.findOne({ where: { id } });

            if (!post) {
                return BaseResponse.error<boolean>(
                    HttpStatus.NOT_FOUND,
                    `Post with id ${id} not found`,
                    'Internal Server Error',
                );
            }

            await this.postRepository.remove(post);

            return BaseResponse.success<boolean>('Post removed successfully', true);
        } catch (error) {
            console.error('Error removing post:', error);
            return BaseResponse.error<boolean>(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Could not remove post',
                'Internal Server Error',
            );
        }
    }

    async find(criteria: Record<string, any>): Promise<BaseResponse<PostModel[]>> {
        try {
            const posts = await this.postRepository.find(criteria);
            const postModels = await Promise.all(posts.map(post => this.entityToModel(post)));
            return BaseResponse.success<PostModel[]>('Posts found successfully', postModels);
        } catch (error) {
            console.error('Error finding posts:', error);
            return BaseResponse.error<PostModel[]>(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Could not find posts',
                'Internal Server Error',
            );
        }
    }

    async count(criteria: Record<string, any>): Promise<BaseResponse<number>> {
        try {
            const count = await this.postRepository.count(criteria);
            return BaseResponse.success<number>('Posts counted successfully', count);
        } catch (error) {
            console.error('Error counting posts:', error);
            return BaseResponse.error<number>(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Could not count posts',
                'Internal Server Error',
            );
        }
    }

    async exportToExcel(filename: string): Promise<BaseResponse<string>> {
        try {
            const posts = await this.postRepository.find();
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Posts');

            // Define columns
            const columns = [
                { header: 'ID', key: 'id', width: 10 },
                { header: 'Title', key: 'title', width: 30 },
                { header: 'Content', key: 'content', width: 50 },
                { header: 'CreatedAt', key: 'createdAt', width: 20 },
                { header: 'UpdatedAt', key: 'updatedAt', width: 20 },
            ];

            // Add columns to the worksheet
            worksheet.columns = columns;

            // Add data to the worksheet
            posts.forEach(post => {
                worksheet.addRow({
                    id: post.id,
                    title: post.title,
                    content: post.content,
                    createdAt: post.createdAt,
                    updatedAt: post.updatedAt,
                });
            });

            // Save the Excel file
            const filePath = `./exports/${filename}.xlsx`;
            await workbook.xlsx.writeFile(filePath);

            return BaseResponse.success<string>('Exported successfully', filePath);
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            return BaseResponse.error<string>(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Could not export to Excel',
                'Internal Server Error',
            );
        }
    }


    async entityToModel(entity: Post): Promise<PostModel> {
        return new PostModel(entity.id, entity.title, entity.content, entity.createdAt, entity.updatedAt);
    }

    async dtoToEntity(dto: PostDTO): Promise<Post> {
        const user = await this.userRepository.findOne({ where: { id: dto.authorId } });

        if (!user) {
            throw new Error('User not found');
        }

        const post = new Post();
        post.title = dto.title;
        post.content = dto.content;
        post.author = user;

        return post;
    }

}