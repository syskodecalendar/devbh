import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DiamondQuality } from '../database/models/diamond-quality.model';
import { CreateDiamondQualityDto, UpdateDiamondQualityDto } from './dto/diamond-quality.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class DiamondQualityService {
    constructor(
        @InjectModel(DiamondQuality)
        private diamondQualityModel: typeof DiamondQuality,
        private redisService: RedisService,
    ) { }

    async create(createDto: CreateDiamondQualityDto) {
        const quality = await this.diamondQualityModel.create({ ...createDto } as any);
        await this.redisService.del('diamond_qualities:all');
        return quality;
    }

    async findAll() {
        const cacheKey = 'diamond_qualities:all';
        const cached = await this.redisService.get(cacheKey);
        if (cached) return cached;

        const qualities = await this.diamondQualityModel.findAll({
            order: [['display_order', 'ASC']],
        });
        await this.redisService.set(cacheKey, qualities, 86400); // 24 hours
        return qualities;
    }

    async findOne(id: string) {
        const cacheKey = `diamond_qualities:${id}`;
        const cached = await this.redisService.get(cacheKey);
        if (cached) return cached;

        const quality = await this.diamondQualityModel.findByPk(id);
        if (!quality) throw new NotFoundException('Diamond Quality not found');

        await this.redisService.set(cacheKey, quality, 86400);
        return quality;
    }

    async update(id: string, updateDto: UpdateDiamondQualityDto) {
        const quality = await this.diamondQualityModel.findByPk(id);
        if (!quality) throw new NotFoundException('Diamond Quality not found');

        await quality.update(updateDto);

        await this.redisService.del('diamond_qualities:all');
        await this.redisService.del(`diamond_qualities:${id}`);
        return quality;
    }

    async remove(id: string) {
        const quality = await this.diamondQualityModel.findByPk(id);
        if (!quality) throw new NotFoundException('Diamond Quality not found');

        await quality.destroy();

        await this.redisService.del('diamond_qualities:all');
        await this.redisService.del(`diamond_qualities:${id}`);
        return { message: 'Diamond Quality deleted successfully' };
    }
}
