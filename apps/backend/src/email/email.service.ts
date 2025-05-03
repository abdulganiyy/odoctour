import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import  hbs from 'nodemailer-express-handlebars';
import { join } from 'path';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    this.transporter.use(
        'compile',
        hbs({
          viewEngine: {
            partialsDir:  'templates',
            defaultLayout: false,
          },
          viewPath: 'src/email/templates',
          extName: '.hbs'
        }),
      );
  }

  async sendEmail(
    to: string,
    subject: string,
    template: string,
    context: any,
  ) {
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      template,
      context,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Error sending email: ${error.message}`);
    }
  }
}