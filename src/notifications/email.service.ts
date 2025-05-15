import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter;
    private appName: string = 'Bibliotech';
    private appUrl: string = 'http://localhost:3000';

    constructor(private configService: ConfigService){
        this.transporter = nodemailer.createTransport({
            host: this.configService.get<string>('EMAIL_HOST'),
            port: this.configService.get<number>('EMAIL_PORT'),
            secure: false,
            auth: {
                user: this.configService.get<string>('EMAIL_USER'),
                pass: this.configService.get<string>('EMAIL_PASSWORD')
            },
        });
        //console.log(this.configService.get<string>('EMAIL_USER'));
        //console.log(this.configService.get<string>('EMAIL_PASSWORD'));
    }


    async sendVerifCodeEmail(email: string, code: string): Promise<void> {
        const mailOptions = {
            from: `"${this.appName}" <miguel.suarezo@autonoma.edu.co>`,
            to: email,
            subject: 'Bibliotech Verif',
            text: `Tu código de verificación de Bibliotech es: ${code}`
        };
        await this.transporter.sendMail(mailOptions);
    }

    async sendGenericEmail(email: string, subject: string, text: string): Promise<void> {
        const mailOptions = {
            from: `"${this.appName}" <miguel.suarezo@autonoma.edu.co>`,
            to: email,
            subject: subject,
            text: text
        };
        await this.transporter.sendMail(mailOptions);
    }
}
