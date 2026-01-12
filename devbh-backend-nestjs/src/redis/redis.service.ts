import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(RedisService.name);
    private redisClient: Redis;

    constructor(private configService: ConfigService) { }

    onModuleInit() {
        this.redisClient = new Redis({
            host: this.configService.get<string>('REDIS_HOST', 'localhost'),
            port: this.configService.get<number>('REDIS_PORT', 6379),
            password: this.configService.get<string>('REDIS_PASSWORD'),
            lazyConnect: true, // Don't connect immediately on instantiation
            retryStrategy: (times) => {
                // Retry with exponential backoff, max 3 seconds
                const delay = Math.min(times * 50, 3000);
                return delay;
            },
        });

        this.redisClient.on('error', (err) => {
            this.logger.error(`Redis connection error: ${err.message}`);
        });

        this.redisClient.on('connect', () => {
            this.logger.log('Redis connected successfully');
        });

        // Connect manually to handle initial connection errors gracefully provided by lazyConnect
        this.redisClient.connect().catch((err) => {
            this.logger.error(`Failed to connect to Redis on init: ${err.message}`);
        });
    }

    onModuleDestroy() {
        this.redisClient.disconnect();
    }

    async get<T>(key: string): Promise<T | null> {
        try {
            const value = await this.redisClient.get(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            this.logger.error(`Failed to get key ${key}: ${error.message}`);
            return null; // Fail safe
        }
    }

    async set(key: string, value: any, ttl?: number): Promise<void> {
        try {
            const stringValue = JSON.stringify(value);
            if (ttl) {
                await this.redisClient.set(key, stringValue, 'EX', ttl);
            } else {
                await this.redisClient.set(key, stringValue);
            }
        } catch (error) {
            this.logger.error(`Failed to set key ${key}: ${error.message}`);
        }
    }

    async del(key: string): Promise<void> {
        try {
            await this.redisClient.del(key);
        } catch (error) {
            this.logger.error(`Failed to delete key ${key}: ${error.message}`);
        }
    }

    async reset(): Promise<void> {
        try {
            await this.redisClient.flushall();
        } catch (error) {
            this.logger.error(`Failed to flush Redis: ${error.message}`);
        }
    }
}
