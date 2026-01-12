import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MetalColor } from '../database/models/metal-color.model';
import { CreateMetalColorDto, UpdateMetalColorDto } from './dto/metal-color.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class MetalColorService {
    constructor(
        @InjectModel(MetalColor)
        private metalColorModel: typeof MetalColor,
        private redisService: RedisService,
    ) { }

    async create(createDto: CreateMetalColorDto) {
        const color = await this.metalColorModel.create({ ...createDto } as any);
        await this.redisService.del('metal_colors:all');
        return color;
    }

    async findAll() {
        const cacheKey = 'metal_colors:all';
        const cached = await this.redisService.get(cacheKey);
        if (cached) return cached;

        const colors = await this.metalColorModel.findAll();
        await this.redisService.set(cacheKey, colors, 86400); // 24 hours
        return colors;
    }

    async findOne(id: string) {
        const cacheKey = `metal_colors:${id}`;
        const cached = await this.redisService.get(cacheKey);
        if (cached) return cached;

        const color = await this.metalColorModel.findByPk(id);
        if (!color) throw new NotFoundException('Metal Color not found');

        await this.redisService.set(cacheKey, color, 86400);
        return color;
    }

    async update(id: string, updateDto: UpdateMetalColorDto) {
        const color = await this.metalColorModel.findByPk(id);
        if (!color) throw new NotFoundException('Metal Color not found');

        await color.update(updateDto);

        await this.redisService.del('metal_colors:all');
        await this.redisService.del(`metal_colors:${id}`);
        return color;
    }

    async remove(id: string) {
        const color = await this.metalColorModel.findByPk(id);
        if (!color) throw new NotFoundException('Metal Color not found');

        await color.destroy();

        await this.redisService.del('metal_colors:all');
        await this.redisService.del(`metal_colors:${id}`);
        return { message: 'Metal Color deleted successfully' };
    }
}
