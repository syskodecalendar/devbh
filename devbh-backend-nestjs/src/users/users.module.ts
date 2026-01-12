import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../database/models/user.model';
import { Profile } from '../database/models/profile.model';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Session } from 'src/database/models';

@Module({
    imports: [SequelizeModule.forFeature([User, Profile, Session])],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService],
})
export class UsersModule { }
