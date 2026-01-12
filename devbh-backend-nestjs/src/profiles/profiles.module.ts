import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Profile } from '../database/models/profile.model';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

@Module({
    imports: [SequelizeModule.forFeature([Profile])],
    controllers: [ProfilesController],
    providers: [ProfilesService],
})
export class ProfilesModule { }
