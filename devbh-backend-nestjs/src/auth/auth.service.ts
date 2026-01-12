import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto, SignupDto } from './dto/auth.dto';
import { User } from '../database/models/user.model';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async signup(signupDto: SignupDto) {
        const existing = await this.usersService.findOneByEmail(signupDto.email);
        if (existing) {
            throw new ConflictException('Email already exists');
        }

        const password_hash = await bcrypt.hash(signupDto.password, 10);
        const user = await this.usersService.create({
            email: signupDto.email,
            password_hash,
            fullName: signupDto.fullName,
        });

        return this.generateTokens(user);
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findOneByEmail(loginDto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Safely obtain the hash from the Sequelize instance
        // Try possible property names and instance getters
        const passwordHash =
            (user as any).password_hash ??
            (user as any).passwordHash ??
            (typeof user.get === 'function' && user.get('password_hash')) ??
            (typeof user.getDataValue === 'function' && user.getDataValue('password_hash'));

        if (!passwordHash || typeof loginDto.password !== 'string') {
            // Log for debugging (do not leak sensitive info in production logs)
            // this.logger.warn(`Missing password hash for user ${user.id}`);
            throw new UnauthorizedException('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(loginDto.password, passwordHash);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.generateTokens(user);
    }


    async generateTokens(user: User) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return {
            accessToken: this.jwtService.sign(payload),
            refreshToken: this.jwtService.sign(payload, { expiresIn: '7d', secret: process.env.JWT_REFRESH_SECRET }),
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            }
        };
    }

    async validateUser(id: string): Promise<User | null> {
        return this.usersService.findOneById(id);
    }

    async refreshTokens(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            });

            const user = await this.usersService.findOneById(payload.sub);
            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            return this.generateTokens(user);
        } catch (e) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }
}
