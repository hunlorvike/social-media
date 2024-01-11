// register.dto.ts
import { IsNotEmpty, IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDTO {
    @IsNotEmpty({ message: 'Full name cannot be empty' })
    @IsString({ message: 'Full name must be a string' })
    fullName: string;

    @IsNotEmpty({ message: 'Email cannot be empty' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsNotEmpty({ message: 'Password cannot be empty' })
    @IsString({ message: 'Password must be a string' })
    @MinLength(6)
    password: string;

}
