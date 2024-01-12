import * as bcrypt from 'bcrypt';
import { Injectable, NotFoundException, UnauthorizedException, ConflictException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { UserDTO } from 'src/dtos/user.dto';
import { Role } from 'src/entities/role.entity';
import { JwtService } from '@nestjs/jwt';
import { RegisterDTO } from 'src/dtos/register.dto';
import { LoginDTO } from 'src/dtos/login.dto';
import { JWT_CONFIG } from 'src/configs/jwt.config';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        private readonly jwtService: JwtService

    ) { }

    async register(registerDTO: RegisterDTO): Promise<User> {
        try {
            // Check if the user already exists
            const existingUser = await this.userRepository.findOne({ where: { email: registerDTO.email } });

            if (existingUser) {
                throw new ConflictException('User with this email already exists');
            }

            // Create a new user
            const newUser = this.userRepository.create(registerDTO);

            // Hash the password before saving it to the database
            newUser.password = await bcrypt.hash(registerDTO.password, 10);

            // Find or create the "User" role
            const roleName = 'User';
            let userRole = await this.roleRepository.findOne({ where: { roleName } });

            if (!userRole) {
                userRole = await this.roleRepository.create({ roleName });
                userRole = await this.roleRepository.save(userRole);
            }

            newUser.roles = [userRole];

            // Save the user to the database
            return this.userRepository.save(newUser);
        } catch (error) {
            // Handle registration errors
            throw new ConflictException('Could not register user');
        }
    }

    async login(LoginDTO: LoginDTO): Promise<{ accessToken: string }> {
        const { email, password } = LoginDTO;

        // Find the user by email
        const user = await this.userRepository.findOne({
            where: { email },
            relations: ['roles'],
        });
        // Check if the user exists
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Check if the provided password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Generate and return the access token
        const accessTokenObject = await this.generateAccessToken(user);
        return accessTokenObject;
    }


    async changePassword(userId: number, newPassword: string): Promise<void> {
        try {
            // Find the user by ID
            const user = await this.userRepository.findOne({ where: { id: userId } });

            if (!user) {
                throw new NotFoundException('User not found');
            }

            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update the user's password
            await this.userRepository.update(userId, { password: hashedPassword });
        } catch (error) {
            // Handle change password errors
            throw new NotFoundException('Could not change password');
        }
    }

    // Generate Token
    async generateAccessToken(user: Partial<User>): Promise<{ accessToken: string }> {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.roles.map(role => role.roleName),
        };

        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: process.env.JWT_ACCESS_TOKEN_TTL || '3600s',
            secret: process.env.JWT_SECRET || 'aLongSecretStringWhoseBitnessIsEqualToOrGreaterThanTheBitnessOfTheTokenEncryptionAlgorithm',
        });

        return { accessToken };
    }

    // Valid token
    async validateToken(token: string): Promise<any> {
        try {
            return this.jwtService.verify(token);
        } catch (error) {
            throw error;
        }
    }

    // Get role
    async getUserRoles(userId: number): Promise<string[]> {
        try {
            const user = await this.userRepository.findOne({
                where: { id: userId },
                relations: ['roles'],
            });

            if (user) {
                return user.roles.map((role) => role.roleName);
            }

            return [];
        } catch (error) {
            console.error('Error getting user roles:', error);
            throw new Error('Could not get user roles');
        }
    }


}
