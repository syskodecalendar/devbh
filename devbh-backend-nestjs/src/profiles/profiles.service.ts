import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Profile } from '../database/models/profile.model';

@Injectable()
export class ProfilesService {
    constructor(
        @InjectModel(Profile)
        private profileModel: typeof Profile,
    ) { }

    async findOne(id: string) {
        const profile = await this.profileModel.findByPk(id);
        if (!profile) throw new NotFoundException('Profile not found');
        return profile;
    }

    async update(id: string, data: Partial<Profile>) {
        const profile = await this.findOne(id);
        return profile.update(data);
    }
}
