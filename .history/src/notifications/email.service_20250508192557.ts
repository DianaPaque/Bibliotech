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
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: this.configService.get<string>()
            }

        })
    }
}
