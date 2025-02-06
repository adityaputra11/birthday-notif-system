import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { EmailData } from './config.type';


@Injectable()
export class EmailService {
  constructor(private readonly httpService: HttpService) {}

  async sendEmail(data:EmailData): Promise<any> {
    const url = 'https://email-service.digitalenvision.com.au/send-email';
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, data, { headers })
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || error.message);
    }
  }
}