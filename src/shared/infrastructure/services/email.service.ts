import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly emailJsApiUrl =
    'https://api.emailjs.com/api/v1.0/email/send';

  async sendEmail(
    templateId: string,
    templateParams: Record<string, any>,
    toEmail: string[],
  ): Promise<void> {
    try {
      const serviceId = process.env.EMAILJS_SERVICE_ID;
      const publicKey = process.env.EMAILJS_PUBLIC_KEY;
      const privateKey = process.env.EMAILJS_PRIVATE_KEY;
      for (const element of toEmail) {
        const payload = {
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          accessToken: privateKey,
          template_params: {
            ...templateParams,
            to_email: element,
          },
        };
        await axios.post(this.emailJsApiUrl, payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        this.logger.log(`Email sent successfully to ${element}`);
      }
    } catch (error) {
      this.logger.error('Error sending email', error);
      throw error;
    }
  }
}
