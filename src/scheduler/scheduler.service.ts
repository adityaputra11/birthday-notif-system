import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import * as moment from 'moment-timezone';
import { Users } from 'src/users/users.entity';

@Injectable()
export class SchedulerService {
  constructor(@InjectQueue("schedulerQueue") private schedulerQueue: Queue) { }


  async scheduleBirthdayMessage(user: Users) {
    // Get user's birthday time in their local timezone
    console.log({ user })
    const now = moment();
    const birthdayTime = "09:00"; // Time to send birthday message

    // Parse birthday in user's timezone
    const birthdayThisYearStr = `${now.year()}-${user.birthday} ${birthdayTime}`;
    const nextBirthdayLocal = moment.tz(birthdayThisYearStr, 'YYYY-MM-DD HH:mm', user.timezone);
    if (nextBirthdayLocal.isBefore(now)) {
      nextBirthdayLocal.add(1, 'year');
    }

    // Create cron pattern in user's local timezone
    const pattern = `0 ${nextBirthdayLocal.minute()} ${nextBirthdayLocal.hour()} ${nextBirthdayLocal.date()} ${nextBirthdayLocal.month() + 1} *`;

    await this.schedulerQueue.upsertJobScheduler(
      `birthday-${user.id}`,
      {
        pattern,
        tz: user.timezone
      },
      {
        name: 'send-birthday-message',
        data: {
          userId: user.id,
          email: user.email,
          name: `${user.firstname} ${user.lastname}`,
          userTimezone: user.timezone // Store timezone for reference
        },
        opts: {
          priority: 1,
          attempts:30,
          backoff:{
            type:'exponential',
            delay: 60 * 1000 // 60 s delay exponential retry when failed
          }
        },
      }
    );

    console.log(`✅ Birthday job scheduled for user ${user.id} at ${birthdayTime} ${user.timezone}`);
  }

  async cancelBirthdayScheduler(userId: number) {
    const jobKey = `birthday-${userId}`
    const result = await this.schedulerQueue.removeJobScheduler(jobKey)
    return result
  }
}
