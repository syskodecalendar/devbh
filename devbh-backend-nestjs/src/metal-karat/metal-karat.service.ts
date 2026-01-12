import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MetalKarat } from '../database/models/metal-karat.model';
import { CreateMetalKaratDto, UpdateMetalKaratDto } from './dto/metal-karat.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class MetalKaratService {
    constructor(
        @InjectModel(MetalKarat)
        private metalKaratModel: typeof MetalKarat,
        private redisService: RedisService,
    ) { }

    async create(createDto: CreateMetalKaratDto) {
        const karat = await this.metalKaratModel.create({ ...createDto } as any);
        await this.redisService.del('metal_karats:all');
        return karat;
    }

    async findAll() {
        const cacheKey = 'metal_karats:all';
        const cached = await this.redisService.get(cacheKey);
        if (cached) return cached;

        const karats = await this.metalKaratModel.findAll({
            order: [['display_order', 'ASC']],
        });
        await this.redisService.set(cacheKey, karats, 86400); // 24 hours
        return karats;
    }

    async findOne(id: string) {
        const cacheKey = `metal_karats:${id}`;
        const cached = await this.redisService.get(cacheKey);
        if (cached) return cached;

        const karat = await this.metalKaratModel.findByPk(id);
        if (!karat) throw new NotFoundException('Metal Karat not found');

        await this.redisService.set(cacheKey, karat, 86400);
        return karat;
    }

    async update(id: string, updateDto: UpdateMetalKaratDto) {
        const karat = await this.metalKaratModel.findByPk(id);
        if (!karat) throw new NotFoundException('Metal Karat not found');

        await karat.update(updateDto);

        await this.redisService.del('metal_karats:all');
        await this.redisService.del(`metal_karats:${id}`);
        return karat;
    }

    async remove(id: string) {
        const karat = await this.metalKaratModel.findByPk(id);
        if (!karat) throw new NotFoundException('Metal Karat not found');

        await karat.destroy();

        await this.redisService.del('metal_karats:all');
        await this.redisService.del(`metal_karats:${id}`);
        return { message: 'Metal Karat deleted successfully' };
    }
}
