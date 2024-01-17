import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class PostDTO {
    @IsNotEmpty({ message: 'Title cannot be empty' })
    @IsString({ message: 'Title must be a string' })
    title: string;

    @IsNotEmpty({ message: 'Content cannot be empty' })
    @IsString({ message: 'Content must be a string' })
    content: string;

    @IsNotEmpty({ message: 'AuthorId cannot be empty' })
    @IsNumber({}, { message: 'AuthorId must be a number' })
    authorId: number;

    @IsOptional() // Make thumbnail optional
    @IsString({ message: 'Thumbnail must be a string' })
    thumbnail?: string;
}
