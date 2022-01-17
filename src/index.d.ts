import { Prisma } from '@prisma/client';
import { RedisOptions } from 'ioredis';
interface PrimsaCacheOptions {
    redisOptions: RedisOptions;
    instances: {
        model: Prisma.ModelName;
        action: Prisma.PrismaAction;
        ttl?: number;
        keyPrefix?: string;
    }[];
}
declare function prismaCacheMiddleware(options: PrimsaCacheOptions): (params: any, next: (params: any) => Promise<any>) => Promise<any>;
export default prismaCacheMiddleware;
