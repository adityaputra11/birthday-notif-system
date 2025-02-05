import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EmailService {
  constructor(private readonly httpService: HttpService) {}

  async sendEmail(): Promise<any> {
    const url = 'https://email-service.digitalenvision.com.au/send-email';
    const data = {
      email: 'test@digitalenvision.com.au',
      message: 'Hi, nice to meet you.'
    };
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