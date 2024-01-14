import { Controller, Post, Body, Req, HttpStatus, HttpException, Get, Param, Put, Delete, Query, UsePipes, ValidationPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostDTO } from 'src/dtos/post.dto';
import { PostModel } from 'src/models/post.model';
import { BaseResponse } from 'src/response/base.response';
import { PostService } from 'src/services/post.service';

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService, private readonly jwtService: JwtService,) { }

    @Get()
    async findAll(): Promise<BaseResponse<PostModel[]>> {
        return this.postService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<BaseResponse<PostModel>> {
        return this.postService.findOne(id);
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async create(@UploadedFile() file, @Req() request: any): Promise<BaseResponse<number | boolean | PostModel | PostModel[]>> {
        try {
            const token = request.headers.authorization;
            const secretKey = process.env.JWT_SECRET || "aLongSecretStringWhoseBitnessIsEqualToOrGreaterThanTheBitnessOfTheTokenEncryptionAlgorithm";
            const decodedToken = await this.jwtService.verifyAsync(token, { secret: secretKey });

            if (!decodedToken || !decodedToken.sub) {
                return BaseResponse.error<number | boolean | PostModel | PostModel[]>(
                    HttpStatus.UNAUTHORIZED,
                    'Invalid or incomplete token',
                    'Unauthorized',
                );
            }
            const authorId = decodedToken.sub;

            const title = request.body.title !== undefined ? request.body.title : '';
            const content = request.body.content !== undefined ? request.body.content : '';

            const postData = { title, content, authorId };

            // Form data has been processed here
            console.log(postData);

            return this.postService.create(postData);
        } catch (error) {
            console.log(error);
            if (error.name === 'TokenExpiredError') {
                throw new HttpException('Token has expired', HttpStatus.UNAUTHORIZED);
            }

            throw new HttpException('Error creating post', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('file'))
    async update(@Param('id') id: number, @UploadedFile() file, @Req() request: any): Promise<BaseResponse<PostModel>> {
        try {
            const token = request.headers.authorization;
            const secretKey = process.env.JWT_SECRET || "aLongSecretStringWhoseBitnessIsEqualToOrGreaterThanTheBitnessOfTheTokenEncryptionAlgorithm";
            const decodedToken = await this.jwtService.verifyAsync(token, { secret: secretKey });

            if (!decodedToken || !decodedToken.sub) {
                return BaseResponse.error<PostModel>(
                    HttpStatus.UNAUTHORIZED,
                    'Invalid or incomplete token',
                    'Unauthorized',
                );
            }
            const authorId = decodedToken.sub;

            // Get the title and content from the form data
            const title = request.body.title !== undefined ? request.body.title : '';
            const content = request.body.content !== undefined ? request.body.content : '';

            const postData = { title, content, authorId };

            return this.postService.update(id, postData);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new HttpException('Token has expired', HttpStatus.UNAUTHORIZED);
            }

            throw new HttpException('Error updating post', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: number, @Req() request): Promise<BaseResponse<boolean>> {
        try {
            const token = request.headers.authorization;
            const secretKey = process.env.JWT_SECRET || "aLongSecretStringWhoseBitnessIsEqualToOrGreaterThanTheBitnessOfTheTokenEncryptionAlgorithm";
            const decodedToken = await this.jwtService.verifyAsync(token, {
                secret: secretKey,
            });

            if (!decodedToken || !decodedToken.sub) {
                return BaseResponse.error<boolean>(
                    HttpStatus.UNAUTHORIZED,
                    'Invalid or incomplete token',
                    'Unauthorized',
                );
            }
            const authorId = decodedToken.sub;
            await this.postService.removeByAuthor(id, authorId);
            return BaseResponse.success<boolean>('Post removed successfully', true);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new HttpException('Token has expired', HttpStatus.UNAUTHORIZED);
            }

            throw new HttpException('Error removing post', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('find')
    async find(@Query() query: Record<string, any>): Promise<BaseResponse<PostModel[]>> {
        return this.postService.find(query);
    }

    @Get('count')
    async count(@Query() query: Record<string, any>): Promise<BaseResponse<number>> {
        return this.postService.count(query);
    }
}
