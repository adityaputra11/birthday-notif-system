import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('schedulerQueue')
export class SchedulerProcessor extends WorkerHost {
  async process(job: Job<any, any, string>): Promise<any> {
    if (job.name.includes('birthday')){
        return this.handleSendBirthdayMessage(job);
    }
  }

  

  private async handleSendBirthdayMessage(job: Job) {
    const { userId } = job.data;
    console.log(`Mengirim pesan ulang tahun ke User ID: ${userId}`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(`Pesan ulang tahun untuk User ID: ${userId} berhasil dikirim.`);
  }
}