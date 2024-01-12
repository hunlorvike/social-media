import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { LoginDTO } from 'src/dtos/login.dto';
import { RegisterDTO } from 'src/dtos/register.dto';
import { User } from 'src/entities/user.entity';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() registerDTO: RegisterDTO): Promise<User> {
        return this.authService.register(registerDTO);
    }

    @Post('login')
    @HttpCode(200)
    async login(@Body() loginDTO: LoginDTO): Promise<{ accessToken: string }> {
        return this.authService.login(loginDTO);
    }

}
