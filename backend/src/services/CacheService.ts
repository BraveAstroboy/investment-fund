import dotenv from 'dotenv';
import { logger } from '../utils/logger';
import redisClient from '../config/redis';
import { Redis } from 'ioredis';

dotenv.config();

// Define a simplified interface for our Redis operations
interface RedisLike {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<any>;
  del(key: string): Promise<any>;
}

class CacheService {
    private readonly METRICS_CACHE_KEY = 'fund_metrics';
    private readonly METRICS_CACHE_TTL: number;

    constructor() {
        this.METRICS_CACHE_TTL = parseInt(process.env.METRICS_CACHE_TTL || '60');
    }

    async setFundMetrics(metrics: any): Promise<void> {
        try {
            // Try to use setex if it's Redis, fall back to set if it's a mock
            if (redisClient instanceof Redis) {
                await redisClient.setex(
                    this.METRICS_CACHE_KEY,
                    this.METRICS_CACHE_TTL,
                    JSON.stringify(metrics)
                );
            } else {
                // Cast to RedisLike to ensure we have access to set
                const client = redisClient as RedisLike;
                await client.set(
                    this.METRICS_CACHE_KEY,
                    JSON.stringify(metrics)
                );
            }
            logger.debug('Fund metrics cached successfully');
        } catch (error) {
            logger.error('Failed to cache fund metrics:', error);
            // Don't throw error, just log it - allows the application to continue
        }
    }

    async getFundMetrics(): Promise<any | null> {
        try {
            // Cast to RedisLike to ensure we have access to get
            const client = redisClient as RedisLike;
            const cachedMetrics = await client.get(this.METRICS_CACHE_KEY);
            if (cachedMetrics) {
                logger.debug('Retrieved fund metrics from cache');
                return JSON.parse(cachedMetrics);
            }
            logger.debug('No cached fund metrics found');
            return null;
        } catch (error) {
            logger.error('Failed to get cached fund metrics:', error);
            return null;
        }
    }

    async invalidateMetrics(): Promise<void> {
        try {
            // Cast to RedisLike to ensure we have access to del
            const client = redisClient as RedisLike;
            await client.del(this.METRICS_CACHE_KEY);
            logger.debug('Fund metrics cache invalidated');
        } catch (error) {
            logger.error('Failed to invalidate metrics cache:', error);
            // Don't throw error, just log it
        }
    }
}

export default new CacheService(); 