import { ConfigService } from "@nestjs/config";
import {TypeOrmModuleOptions} from "@nestjs/typeorm"

export const getMySqlConfig = async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
  return {
    type: 'mysql',
    host: configService.get('MYSQL_HOST'),
    port: parseInt(configService.get('MYSQL_PORT')) || 3306,
    username: configService.get('MYSQL_LOGIN'),
    password: configService.get('MYSQL_PASSWORD'),
    database: configService.get('MYSQL_NAME'),
    entities: ["dist/**/*.entity{.ts,.js}"],
    synchronize: true
  }
}

