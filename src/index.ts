import RedisClient, { Redis, RedisOptions } from 'ioredis';

interface PrimsaCacheOptions {
    redisOptions: RedisOptions
    instances: {
        model: string,
        action: string,
        ttl?: number
        keyPrefix?: string
    }[]
}

type PrismaMiddlewareParams = {
    model?: string;
    action: string;
    args: any;
    dataPath: string[];
    runInTransaction: boolean;
}

class cacheMiddleware <Prisma> {
    private redisClient: Redis;
    private instances: {
        model: string,
        action: string,
        ttl?: number,
        keyPrefix?: string
    }[];

    constructor(options: PrimsaCacheOptions){
        autoBind(this);

        this.instances = options.instances;
        this.redisClient = new RedisClient(options.redisOptions);
    }

    public async handle(params: PrismaMiddlewareParams, next: (params: PrismaMiddlewareParams) => Promise<any>){
        let result: any = null;

        for(const instance of this.instances){
            if(instance.model === params.model && instance.action === params.action){
                const cacheKey = `${instance.keyPrefix? instance.keyPrefix + '-': ''}${params.model}:${params.action}:${JSON.stringify(params.args)}`;
                const findCache = await this.redisClient.get(cacheKey);

                if(findCache){
                    result = JSON.parse(findCache);
                }
                else{
                    result = await next(params);
                
                    instance.ttl?
                        await this.redisClient.set(cacheKey, JSON.stringify(result), 'EX', instance.ttl):
                        await this.redisClient.set(cacheKey, JSON.stringify(result));
                }

                break;
            }
        }

        if(!result){
            result = await next(params); 
        }
        
        return result;
    }
}

const getAllProperties = (object: any) => {
	const properties = new Set();

	do {
		for (const key of Reflect.ownKeys(object)) {
			properties.add([object, key]);
		}
	} while ((object = Reflect.getPrototypeOf(object)) && object !== Object.prototype);

	return properties;
};

function autoBind(self: any) {
	//@ts-ignore
	for (const [object, key] of getAllProperties(self.constructor.prototype)) {
		if (key === 'constructor') {
			continue;
		}

		const descriptor = Reflect.getOwnPropertyDescriptor(object, key);
		if (descriptor && typeof descriptor.value === 'function') {
			self[key] = self[key].bind(self);
		}
	}

	return self;
}

function prismaCacheMiddleware(options: PrimsaCacheOptions) {
    return new cacheMiddleware(options).handle;
}

export default prismaCacheMiddleware;