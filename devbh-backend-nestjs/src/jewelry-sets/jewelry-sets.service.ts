import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JewelrySet } from '../database/models/jewelry-set.model';
import { JewelryMedia } from '../database/models/jewelry-media.model';
import { CreateJewelrySetDto, UpdateJewelrySetDto } from './dto/jewelry-sets.dto';
import { RedisService } from '../redis/redis.service';

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

@Injectable()
export class JewelrySetsService {
    constructor(
        @InjectModel(JewelrySet)
        private setModel: typeof JewelrySet,
        @InjectModel(JewelryMedia)
        private mediaModel: typeof JewelryMedia,
        private redisService: RedisService,
    ) { }

    async findAll() {
        const cacheKey = 'sets:all';
        const cached = await this.redisService.get(cacheKey);
        if (cached) return cached;

        const sets = await this.setModel.findAll({
            include: [JewelryMedia],
            order: [['display_order', 'ASC']]
        });
        await this.redisService.set(cacheKey, sets, 1800); // 30 min TTL
        return sets;
    }

    async findOne(identifier: string) {
        const cacheKey = `sets:detail:${identifier}`;
        const cached = await this.redisService.get(cacheKey);
        if (cached) return cached;

        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

        const set = await this.setModel.findOne({
            where: isUUID ? { id: identifier } : { slug: identifier },
            include: [{ all: true, nested: true }],
        });
        if (!set) throw new NotFoundException('Jewelry Set not found');

        await this.redisService.set(cacheKey, set, 3600); // 1 hour TTL
        return set;
    }

    async findMedia(setId: string) {
        const cacheKey = `sets:media:${setId}`;
        const cached = await this.redisService.get(cacheKey);
        if (cached) return cached;

        const media = await this.mediaModel.findAll({ where: { set_id: setId } });
        await this.redisService.set(cacheKey, media, 3600);
        return media;
    }

    async create(createJewelrySetDto: CreateJewelrySetDto) {
        // Separate media from the rest of the DTO
        const { media, ...setDto } = createJewelrySetDto;

        // Create the set first
        const setId = uuidv4();

        const set = this.setModel.build({ ...setDto, id: setId } as any);
        await set.save();

        if (media && media.length > 0) {
            const mediaWithSetId = media.map(m => ({ ...m, set_id: setId }));
            await this.mediaModel.bulkCreate(mediaWithSetId as any);
        }

        await this.redisService.del('sets:all');

        // Reload to include media
        return this.findOne(setId);
    }

    async update(id: string, updateJewelrySetDto: UpdateJewelrySetDto) {
        const set = await this.setModel.findByPk(id);
        if (!set) throw new NotFoundException('Jewelry Set not found');

        const { media, ...setData } = updateJewelrySetDto;

        await set.update(setData);

        if (media) {
            await this.mediaModel.destroy({ where: { set_id: id } });
            if (media.length > 0) {
                const mediaWithSetId = media.map(m => ({ ...m, set_id: id }));
                await this.mediaModel.bulkCreate(mediaWithSetId as any);
            }
        }

        // Invalidate caches
        await this.redisService.del('sets:all');
        await this.redisService.del(`sets:detail:${id}`);
        if (setData.slug) await this.redisService.del(`sets:detail:${setData.slug}`); // Invalidate new slug if changed
        // Use a more robust approach if we needed old slug, but for now we assume ID based lookup is primary cache or findOne will miss on old slug until TTL expires if we don't fetch old slug first. 
        // Actually, we should invalidate old slug too.
        if (set.slug) await this.redisService.del(`sets:detail:${set.slug}`);

        await this.redisService.del(`sets:media:${id}`);

        return this.findOne(id);
    }

    async remove(id: string) {
        const set = await this.setModel.findByPk(id);
        if (!set) throw new NotFoundException('Jewelry Set not found');

        await set.destroy();

        // Invalidate caches
        await this.redisService.del('sets:all');
        await this.redisService.del(`sets:detail:${id}`);
        if (set.slug) await this.redisService.del(`sets:detail:${set.slug}`);
        await this.redisService.del(`sets:media:${id}`);

        return { message: 'Jewelry Set deleted successfully' };
    }
}
