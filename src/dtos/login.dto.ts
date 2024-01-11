// login.dto.ts
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class LoginDTO {
    @IsNotEmpty({ message: 'Email cannot be empty' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsNotEmpty({ message: 'Password cannot be empty' })
    @IsString({ message: 'Password must be a string' })
    password: string;
}
