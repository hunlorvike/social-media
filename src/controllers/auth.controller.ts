import { Controller, Post, Body, HttpCode, HttpStatus, ConflictException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginDTO } from 'src/dtos/login.dto';
import { RegisterDTO } from 'src/dtos/register.dto';
import { User } from 'src/entities/user.entity';
import { BaseResponse } from 'src/response/base.response';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @HttpCode(200)
    async login(@Body() loginDTO: LoginDTO): Promise<BaseResponse<{ accessToken: string }>> {
        try {
            const result = await this.authService.login(loginDTO);
            return BaseResponse.success('Login successful', result);
        } catch (error) {
            return BaseResponse.error<{ accessToken: string }>(HttpStatus.UNAUTHORIZED, 'Login failed', error.message || 'Unknown error occurred');
        }
    }

    @Post('register')
    async register(@Body() registerDTO: RegisterDTO): Promise<BaseResponse<User>> {
        try {
            const user = await this.authService.register(registerDTO);
            return BaseResponse.success('Registration successful', user);
        } catch (error) {
            if (error instanceof ConflictException) {
                return BaseResponse.error<User>(HttpStatus.CONFLICT, 'Registration failed', error.message);
            } else {
                return BaseResponse.error<User>(HttpStatus.INTERNAL_SERVER_ERROR, 'Registration failed', error.message || 'Unknown error occurred');
            }
        }
    }


}
