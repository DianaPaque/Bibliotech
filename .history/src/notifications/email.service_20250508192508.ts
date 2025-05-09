import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter;
    private appName: string = 'Bibliotech';
    private appUrl: string = 'http://localhost:3000';

    constructor(){
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: this.ConfigService
            }

        })
    }
}
