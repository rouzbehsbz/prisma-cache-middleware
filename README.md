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
    redisOptions: {                    
        host: 'localhost',             
        port: 6379                     
    },
    instances: [{                      
        model: 'Users',                
        action: 'findFirst',           
        ttl: 20,                       
        keyPrefix: 'myCache'             
    },{                                
        model: 'Users',
        action: 'findMany',
    }]
}));

export default prisma;
```
## Prisma cache middleware options
| Option|Description|
| ------------- |-------------|
|`redisOptions`|This is your redis server configuration (same as `ioredis` options)|
|`instances`|Cache instances and the way you want to cache them|

If you pass `{}` to `redisOptions` it will connect to your local running redis server with default port.
otherwise you can specified your server settings, for example `{host: '127.0.0.1', port: 6379}`.

## Instances
| Option|Description|Optional|Example
| ------------- |-------------|-------------|-------------|
|`model`|The Prisma database model name you define in your `schema.prisma`|`false`|`Users`|
|`action`|Query action name you want to cache for this model.|`false`|`findFirst`|
|`ttl`|The TTL or expire time of the cache in seconds|`true`|`10`|
|`keyPrefix`|Key prefix for caches of this instance|`true`|`myCache`|

You can defind cache instances as much as you want and pass array of instances to `instances` option.