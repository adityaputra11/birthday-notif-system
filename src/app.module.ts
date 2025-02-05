import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './config/database.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:'.env'
    }),
    DatabaseModule,
    SchedulerModule,
    UsersModule, ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
