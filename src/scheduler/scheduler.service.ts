import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import * as moment from 'moment-timezone';
import { Users } from 'src/users/users.entity';

@Injectable()
export class SchedulerService {
    constructor(@InjectQueue("schedulerQueue") private schedulerQueue:Queue){}
    

     async scheduleBirthdayMessage(user: Users) {
        const now = moment();
        const nextBirthday = moment.tz(`${moment().year()}-${user.birthday.toString().substring(5)}`, user.timezone);
        
        if (nextBirthday.isBefore(moment())) {
          nextBirthday.add(1, 'year');
        }
    
        nextBirthday.hour(9).minute(0).second(0);
        const delay = nextBirthday.valueOf() - now.valueOf();

        
        await this.schedulerQueue.add(
          `birthday-${user.id}`,
          { userId: user.id },
          { delay, repeat: { every: 365 * 24 * 60 * 60 * 1000 } }
        );

        console.log(`✅ Job berhasil ditambahkan ke queue!`); // Debug log
      }
    
       async cancelExistingJob(userId: number) {
        const job = await this.schedulerQueue.getJob(`birthday-${userId}`);
        await job.remove();
      }
}
