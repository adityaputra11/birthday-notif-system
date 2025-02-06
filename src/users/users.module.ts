import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { SchedulerModule } from 'src/scheduler/scheduler.module';


@Module({
  imports: [TypeOrmModule.forFeature([Users]), SchedulerModule],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
