import { Injectable } from '@nestjs/common'
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm'

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    
    if ( process.env.DBHOST) {
      return {
        type:   'postgres',
        host: process.env.DBHOST,
        port:  Number(process.env.DBPORT),
        database:  process.env.DBDATABASE,
        username:  process.env.DBUSER,
        password:  process.env.DBPASSWORD,
        synchronize: true,
        entities: [__dirname + '/entities/*.entity{.ts,.js}'],
        autoLoadEntities: false,
      }
    }
    return {}
  }
}
