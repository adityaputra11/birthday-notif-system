import { RedisModule } from "@nestjs-modules/ioredis";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { EmailService } from "./email.service";
import { HttpModule, HttpService } from "@nestjs/axios";

@Module({
    imports:[
        HttpModule,
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule], 
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
              const config = {
                type: 'postgres',
                host: configService.get<string>('POSTGRES_HOST'),
                port: configService.get<number>('POSTGRES_PORT'),
                username: configService.get<string>('POSTGRES_USER'),
                password: configService.get<string>('POSTGRES_PASSWORD'),
                database: configService.get<string>('POSTGRES_DB'),
                entities: ["dist/**/*.entity.js"],
                synchronize: true, 
              };
              console.log('Database Config:', {
                ...config,
                password: '****' // Mask password untuk keamanan
              });
              
              return config as TypeOrmModuleOptions
            },
          }),
      
          RedisModule.forRootAsync({
            imports: [ConfigModule], 
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
              type: 'single',
              host: configService.get<string>('REDIS_HOST'),
              port: configService.get<number>('REDIS_PORT'),
            }),
          }),
    ],
    providers:[EmailService],
    exports:[RedisModule, TypeOrmModule, HttpModule],
})
export class DatabaseModule {}