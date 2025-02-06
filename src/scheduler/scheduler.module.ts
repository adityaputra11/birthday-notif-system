import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SchedulerService } from './scheduler.service';
import { SchedulerProcessor } from './scheduler.processor';
import { EmailService } from 'src/config/email.service';
import { DatabaseModule } from 'src/config/database.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    BullModule.registerQueueAsync({
      name: 'schedulerQueue',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SchedulerService, SchedulerProcessor, EmailService],
  exports: [SchedulerService, BullModule],
})
export class SchedulerModule {}