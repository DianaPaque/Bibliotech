import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
@Injectable()
export class NotificationsService {
    private transporter;
    private appName: string = 'Bibliotech';
    private appUrl: string = 'http://localhost:3000';
    


}
