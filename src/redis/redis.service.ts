import { CacheModuleOptions, CacheOptionsFactory, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store'

@Injectable()
export class RedisService implements CacheOptionsFactory {
  constructor (
    private configService: ConfigService
  ) {}

  public createCacheOptions(): CacheModuleOptions<any> {
    return {
      store: redisStore.create(),
      host: this.configService.get<string>('REDIS_HOST', '127.0.0.1'),
      port: this.configService.get<number>('REDIS_PORT', 6379)
    }
  }
}
