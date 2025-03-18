import Redis from 'ioredis';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

const isDev = process.env.NODE_ENV !== 'production';

// Create a Mock Redis client for development if needed
class MockRedis {
    private store: Map<string, any> = new Map();
    
    async get(key: string): Promise<any> {
        return this.store.get(key) || null;
    }
    
    async set(key: string, value: any): Promise<'OK'> {
        this.store.set(key, value);
        return 'OK';
    }
    
    async setex(key: string, _seconds: number, value: any): Promise<'OK'> {
        this.store.set(key, value);
        return 'OK';
    }
    
    async del(key: string): Promise<number> {
        const had = this.store.has(key);
        this.store.delete(key);
        return had ? 1 : 0;
    }
}

// Check if we should use Redis
const useRealRedis = !isDev || (process.env.USE_REDIS_IN_DEV === 'true');

// Use a generic type to allow for both real Redis and our mock
let redisClient: Redis | MockRedis;

if (useRealRedis) {
    try {
        const redis = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            password: process.env.REDIS_PASSWORD || undefined, // Add password support
            maxRetriesPerRequest: 3,
            retryStrategy: (times) => Math.min(times * 100, 3000), // Retry with backoff
            enableReadyCheck: true,
            showFriendlyErrorStack: isDev
        });

        redis.on('error', (err) => {
            // Don't fail in development if Redis is not available
            if (isDev) {
                logger.warn(`Redis Client Error: ${err.message}. Using mock Redis instead.`);
                redisClient = new MockRedis();
            } else {
                logger.error('Redis Client Error:', err);
            }
        });

        redis.on('connect', () => {
            logger.info('Redis Client Connected');
        });
        
        redisClient = redis;
    } catch (error) {
        if (isDev) {
            logger.warn('Failed to initialize Redis client, using mock implementation');
            redisClient = new MockRedis();
        } else {
            throw error;
        }
    }
} else {
    logger.info('Using mock Redis implementation in development mode');
    redisClient = new MockRedis();
}

// Export with type assertion to ensure common methods are available
export default redisClient; 