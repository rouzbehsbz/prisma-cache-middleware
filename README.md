# Prisma cache middleware

Prisma is one of the greatest ORMs for Node.js with lot of features, with this middleware you can cache your database queries into the Redis (one of the fastest in-memory databases for caching) and reduce your database queries. You need to have pre-installed redis server in order to work with this module.
## Install
```sh
npm i prisma-cache-middleware
```
## Basic Example
```sh
import { PrismaClient } from '@prisma/client'
import prismaCacheMiddleware from 'prisma-cache-middleware';

const prisma = new PrismaClient();

prisma.$use(prismaCacheMiddleware({
    redisOptions: {                    // Your redis server connection options (same is `ioredis` options)
        host: 'localhost',             // Your redis host address
        port: 6379                     // Your redis port number
    },
    instances: [{                      // Here you can define your cache instances (as many as you want)
        model: 'Users',                // First you must set your prisma model name
        action: 'findFirst',           // Then set the action you want to cache like `create` or `findFirst`
        ttl: 20,                       // Optional TTL (cache expire time) in seconds
        keyPrefix: 'cache'             // Optional key prefix for cached keys in redis
    },{                                // Next cache instance. you can define more
        model: 'Users',
        action: 'findMany',
    }]
}));

export default prisma;
```