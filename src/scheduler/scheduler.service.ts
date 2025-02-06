import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import * as moment from 'moment-timezone';
import { Users } from 'src/users/users.entity';

@Injectable()
export class SchedulerService {
  constructor(@InjectQueue("schedulerQueue") private schedulerQueue: Queue) { }


  async scheduleBirthdayMessage(user: Users) {
    const now = moment();
    let nextBirthdayLocal = moment.tz(`${now.year()}-${user.birthday.toString().substring(5)} 09:00`, user.timezone);

    const serverTimezone = moment.tz.guess();
    const nextBirthdayServer = nextBirthdayLocal.clone().tz(serverTimezone, true); 
    const pattern = `${nextBirthdayServer.second()} ${nextBirthdayServer.minute()} ${nextBirthdayServer.hour()} ${nextBirthdayServer.date()} ${nextBirthdayServer.month() + 1} *`;

    await this.schedulerQueue.upsertJobScheduler(
      `birthday-${user.id}`,
      { pattern, },
      {
        name: 'send-birthday-message',
        data: {
          userId: user.id,
          email: user.email,
          name: `${user.firstname} ${user.lastname}`,
        },
        opts: {
          priority: 1,
        },
      }
    );


    console.log(`✅ Job berhasil ditambahkan ke queue!`); // Debug log
  }

  async cancelBirthdayScheduler(userId: number) {
    const jobKey = `birthday-${userId}`
    const result = await this.schedulerQueue.removeJobScheduler(jobKey)
    return result
  }
}
