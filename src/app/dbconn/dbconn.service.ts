import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class DBConnService implements TypeOrmOptionsFactory {
  constructor (
    private readonly configureService: ConfigService
  ) {}

  public createTypeOrmOptions (): TypeOrmModuleOptions {
    return {
      type: 'mariadb',
      host: this.configureService.get<string>('DB_HOST', 'localhost'),
      port: this.configureService.get<number>('DB_PORT', 3306),
      username: this.configureService.get<string>('DB_USER', 'center'),
      password: this.configureService.get<string>('DB_PASS'),
      database: this.configureService.get<string>('DB_SCHEMA', 'center'),
      entities: [],
      autoLoadEntities: true,
      synchronize: true
    }
  }
}
