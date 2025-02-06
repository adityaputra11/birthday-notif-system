import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailService } from 'src/config/email.service';
import { EmailData } from 'src/config/config.type';

@Processor('schedulerQueue')
export class SchedulerProcessor extends WorkerHost {
  constructor(private readonly emailService:EmailService){
    super();
  }
  async process(job: Job<any, any, string>): Promise<any> {
    if (job.name.includes('birthday')){
        return this.handleSendBirthdayMessage(job);
    }
  }

  @OnWorkerEvent('completed')
  onProgress(job: Job) {
    const { id, name } = job;
    console.log(`Job id: ${id}, name: ${name} completes ${name}%`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    const { id, name } = job;
    console.log(`Job id: ${id}, name: ${name} failed ${name}%`);
  }


  @OnWorkerEvent('closed')
  onClosed(job: Job) {
    const { id, name } = job;
    console.log(`Job id: ${id}, name: ${name} closed ${name}%`);
  }

  private async handleSendBirthdayMessage(job: Job) {
    const { email, name } = job.data;
    const birthdayData:EmailData={
      email,
      message:`Hey, ${name} it’s your birthday`
    }
    await this.emailService.sendEmail(birthdayData)
  }
}