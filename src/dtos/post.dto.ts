import { IsNotEmpty, IsString } from 'class-validator';

export class PostDTO {
    @IsNotEmpty({ message: 'Title cannot be empty' })
    @IsString({ message: 'Title must be a string' })
    title: string;

    @IsNotEmpty()
    @IsString()
    content: string;
}
