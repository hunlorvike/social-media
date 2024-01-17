import {
    Controller,
    Post,
    Body,
    Req,
    HttpStatus,
    HttpException,
    Get,
    Param,
    Put,
    Delete,
    Query,
    UsePipes,
    ValidationPipe,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { PostDTO } from 'src/dtos/post.dto';
import { PostModel } from 'src/models/post.model';
import { BaseResponse } from 'src/response/base.response';
import { PostService } from 'src/services/post.service';
import { FileUtils } from 'src/utils/file.util';

@Controller('posts')
@ApiTags('Post')
export class PostController {
    constructor(
        private readonly postService: PostService,
        private readonly jwtService: JwtService,
    ) { }

    @Get()
    async findAll(): Promise<BaseResponse<PostModel[]>> {
        return this.postService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<BaseResponse<PostModel>> {
        return this.postService.findOne(id);
    }

    @Get('author/:authorId')
    async findAllByAuthor(
        @Param('authorId') authorId: number,
    ): Promise<BaseResponse<PostModel[]>> {
        return this.postService.findAllByAuthor(authorId);
    }

    @Post()
    @UseInterceptors(FileInterceptor('thumbnail', {}))
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Req() request: any,
    ): Promise<BaseResponse<number | boolean | PostModel | PostModel[]>> {
        try {
            const token = request.headers.authorization;
            const secretKey =
                process.env.JWT_SECRET ||
                'aLongSecretStringWhoseBitnessIsEqualToOrGreaterThanTheBitnessOfTheTokenEncryptionAlgorithm';
            const decodedToken = await this.jwtService.verifyAsync(token, {
                secret: secretKey,
            });

            if (!decodedToken || !decodedToken.sub) {
                return BaseResponse.error<number | boolean | PostModel | PostModel[]>(
                    HttpStatus.UNAUTHORIZED,
                    'Invalid or incomplete token',
                    'Unauthorized',
                );
            }

            const authorId = decodedToken.sub;
            const title = request.body.title !== undefined ? request.body.title : '';
            const content =
                request.body.content !== undefined ? request.body.content : '';
            const thumbnail = '';
            const postData = { title, content, thumbnail, authorId };

            if (file) {
                // Fix: Add 'await' here to properly wait for the promise to resolve
                const uploadResult = await FileUtils.uploadFile(file);
                if (uploadResult.success) {
                    postData.thumbnail = uploadResult.filePath;
                } else {
                    throw new HttpException(
                        uploadResult.message,
                        HttpStatus.INTERNAL_SERVER_ERROR,
                    );
                }
            }

            return this.postService.create(postData);
        } catch (error) {
            console.log(error);
            if (error.name === 'TokenExpiredError') {
                throw new HttpException('Token has expired', HttpStatus.UNAUTHORIZED);
            }

            throw new HttpException(
                'Error creating post',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('thumbnail', {}))
    async update(
        @Param('id') id: number,
        @UploadedFile() file: Express.Multer.File,
        @Body() body: PostDTO,
        @Req() request: any,
    ): Promise<BaseResponse<PostModel>> {
        try {
            const token = request.headers.authorization;
            const secretKey =
                process.env.JWT_SECRET ||
                'aLongSecretStringWhoseBitnessIsEqualToOrGreaterThanTheBitnessOfTheTokenEncryptionAlgorithm';
            const decodedToken = await this.jwtService.verifyAsync(token, {
                secret: secretKey,
            });

            if (!decodedToken || !decodedToken.sub) {
                return BaseResponse.error<PostModel>(
                    HttpStatus.UNAUTHORIZED,
                    'Invalid or incomplete token',
                    'Unauthorized',
                );
            }
            const authorId = decodedToken.sub;

            // Get the title and content from the form data
            const title = body.title !== undefined ? body.title : '';
            const content = body.content !== undefined ? body.content : '';
            const thumbnail = '';
            const postData = { title, content, thumbnail, authorId };

            if (file) {
                const uploadResult = await FileUtils.uploadFile(file);
                if (uploadResult.success) {
                    postData.thumbnail = uploadResult.filePath;
                } else {
                    throw new HttpException(
                        uploadResult.message,
                        HttpStatus.INTERNAL_SERVER_ERROR,
                    );
                }
            }

            return this.postService.update(id, postData);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new HttpException('Token has expired', HttpStatus.UNAUTHORIZED);
            }

            throw new HttpException(
                'Error updating post',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Delete(':id')
    async remove(
        @Param('id') id: number,
        @Req() request,
    ): Promise<BaseResponse<boolean>> {
        try {
            const token = request.headers.authorization;
            const secretKey =
                process.env.JWT_SECRET ||
                'aLongSecretStringWhoseBitnessIsEqualToOrGreaterThanTheBitnessOfTheTokenEncryptionAlgorithm';
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

            throw new HttpException(
                'Error removing post',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get('export-posts')
    async exportPostsToExcel(@Query('filename') filename: string) {
        return this.postService.exportToExcel(filename);
    }

    @Get('find')
    async find(
        @Query() query: Record<string, any>,
    ): Promise<BaseResponse<PostModel[]>> {
        return this.postService.find(query);
    }

    @Get('count')
    async count(
        @Query() query: Record<string, any>,
    ): Promise<BaseResponse<number>> {
        return this.postService.count(query);
    }
}
