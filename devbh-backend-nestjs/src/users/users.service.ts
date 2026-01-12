import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserRole } from '../database/models/user.model';
import { Profile } from '../database/models/profile.model';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
    private readonly logger = new Logger(UsersService.name);

    constructor(
        @InjectModel(User)
        private userModel: typeof User,
        @InjectModel(Profile)
        private profileModel: typeof Profile,
        private configService: ConfigService,
    ) { }

    async onModuleInit() {
        await this.createDefaultAdmin();
    }

    private async createDefaultAdmin() {
        const adminEmail = 'admin@devji.com';
        try {
            const existingAdmin = await this.userModel.findOne({ where: { email: adminEmail } });
            if (!existingAdmin) {
                const password = this.configService.get<string>('ADMIN_DEFAULT_PASSWORD', 'Admin@123');
                const passwordHash = await bcrypt.hash(password, 10);

                const admin = await this.userModel.create({
                    email: adminEmail,
                    password_hash: passwordHash,
                    role: UserRole.ADMIN,
                } as any);

                // Create associated profile
                await this.profileModel.create({
                    id: admin.id,
                    email: admin.email,
                    full_name: 'System Admin',
                } as any);

                this.logger.log(`Default admin user created: ${adminEmail}`);
            }
        } catch (error) {
            this.logger.error(`Failed to create default admin: ${error.message}`);
        }
    }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ where: { email }, include: [Profile] });
    }

    async findOneById(id: string): Promise<User | null> {
        return this.userModel.findByPk(id, { include: [Profile] });
    }

    async create(userData: Partial<User> & { fullName?: string }): Promise<User> {
        const user = await this.userModel.create(userData as any);
        await this.profileModel.create({
            id: user.id,
            email: user.email,
            full_name: userData.fullName || '',
        } as any);
        return user;
    }
}
