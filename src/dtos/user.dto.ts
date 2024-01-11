import { IsString, IsEmail, IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator';
import { Gender } from 'src/entities/gender.enum';
import { Role } from 'src/entities/role.entity';

export class UserDTO {
    @IsNotEmpty({ message: 'Full name cannot be empty' })
    @IsString({ message: 'Full name must be a string' })
    fullName: string;

    @IsNotEmpty({ message: 'Gender cannot be empty' })
    gender: Gender;

    @IsNotEmpty({ message: 'Email cannot be empty' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsNotEmpty({ message: 'Phone number cannot be empty' })
    @IsString({ message: 'Phone number must be a string' })
    phone: string;

    @IsNotEmpty({ message: 'Password cannot be empty' })
    @IsString({ message: 'Password must be a string' })
    password: string;

    @IsNotEmpty({ message: 'Refresh token cannot be empty' })
    @IsString({ message: 'Refresh token must be a string' })
    refreshToken: string;
}
