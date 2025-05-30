import { Injectable } from '@nestjs/common';
import { EmailService } from './email.service';

@Injectable()
export class NotificationsService {
    constructor(private readonly mailer: EmailService) {}

    async sendEmailVerifCode(email: string, code: string) {
        await this.mailer.sendVerifCodeEmail(email,code);
    }

    async sendGenericEmail(email: string, subject: string, text: string): Promise<void> {
        await this.mailer.sendGenericEmail(email, subject, text);
    }
    
}
