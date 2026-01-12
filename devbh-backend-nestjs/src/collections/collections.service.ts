import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Collection } from '../database/models/collection.model';
import { JewelrySet } from '../database/models/jewelry-set.model';
import { CreateCollectionDto, UpdateCollectionDto } from './dto/collections.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class CollectionsService {
    constructor(
        @InjectModel(Collection)
        private collectionModel: typeof Collection,
        private redisService: RedisService,
    ) { }

    async findAll() {
        const cacheKey = 'collections:all';
        const cached = await this.redisService.get(cacheKey);
        if (cached) return cached;

        const collections = await this.collectionModel.findAll({
            order: [['display_order', 'ASC']],
        });
        await this.redisService.set(cacheKey, collections, 3600); // 1 hour TTL
        return collections;
    }

    async findOne(identifier: string) {
        await this.redisService.del(`collections:detail:${identifier}`);
        const cacheKey = `collections:detail:${identifier}`;
        const cached = await this.redisService.get(cacheKey);
        if (cached) return cached;

        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

        const collection = await this.collectionModel.findOne({
            where: isUUID ? { id: identifier } : { slug: identifier },
            include: [{ all: true, nested: true }],
        });
        if (!collection) throw new NotFoundException('Collection not found');

        await this.redisService.set(cacheKey, collection, 3600); // 1 hour TTL
        return collection;
    }

    async create(createCollectionDto: CreateCollectionDto) {
        const collection = await this.collectionModel.create({ ...createCollectionDto } as any);
        await this.redisService.del('collections:all');
        return collection;
    }

    async update(id: string, updateCollectionDto: UpdateCollectionDto) {
        const collection = await this.collectionModel.findByPk(id);
        if (!collection) throw new NotFoundException('Collection not found');

        const oldSlug = collection.slug;
        await collection.update(updateCollectionDto);

        // Invalidate specific cache (ID, old slug, new slug) and list cache
        await this.redisService.del(`collections:detail:${id}`);
        if (oldSlug) await this.redisService.del(`collections:detail:${oldSlug}`);
        if (collection.slug && collection.slug !== oldSlug) await this.redisService.del(`collections:detail:${collection.slug}`);

        await this.redisService.del('collections:all');

        return collection;
    }

    async remove(id: string) {
        const collection = await this.collectionModel.findByPk(id);
        if (!collection) throw new NotFoundException('Collection not found');

        await collection.destroy();

        // Invalidate specific cache and list cache
        await this.redisService.del(`collections:detail:${id}`);
        await this.redisService.del(`collections:detail:${collection.slug}`);
        await this.redisService.del('collections:all');

        return { message: 'Collection deleted successfully' };
    }
}
