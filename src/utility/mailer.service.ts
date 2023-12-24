import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import 'dotenv/config';

@Injectable()
export class MailerService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport(
      {
        host: 'smtp.yandex.ru',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.VERIFICATION_EMAIL,
          pass: process.env.VERIFICATION_PASSWORD,
        },
      },
      {
        from: `Mailer <${process.env.VERIFICATION_EMAIL}>`,
      },
    );
  }

  async sendVerificationMail(to: string, userId: number): Promise<void> {
    const mailOptions = {
      to: `${to}`,
      subject: 'Email verification',
      text: `Please verify your account here: ${process.env.APP_HOST}/user/verification/${userId}`,
    };
    await this.transporter.sendMail(mailOptions);
  }

  async sendResetPasswordMail(to: string, token: string): Promise<void> {
    const mailOptions = {
      to: `${to}`,
      subject: 'Email verification',
      text: `Please reset your password here: ${process.env.APP_HOST}/reset-password/${token}`,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
