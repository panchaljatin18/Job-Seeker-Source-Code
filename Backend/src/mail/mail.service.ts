import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;
  private isTestAccount = false;

  constructor(private readonly configService: ConfigService) {
    this.initTransporter();
  }

  private async initTransporter() {
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');
    const host = this.configService.get<string>('SMTP_HOST') || 'smtp.gmail.com';
    const port = this.configService.get<number>('SMTP_PORT') || 587;

    if (user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
      this.logger.log(`Configured production SMTP transport with host ${host}`);
    } else {
      // Create Ethereal test account for dev
      try {
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        this.isTestAccount = true;
        this.logger.log(`Initialized Ethereal dev email account: ${testAccount.user}`);
      } catch {
        this.transporter = nodemailer.createTransport({ jsonTransport: true });
        this.logger.warn('SMTP fallback to JSON transport');
      }
    }
  }

  async sendVerificationEmail(
    to: string,
    name: string,
    otp: string,
    magicLink: string,
  ): Promise<{ success: boolean; previewUrl?: string }> {
    const from =
      this.configService.get<string>('SMTP_FROM') ||
      '"TecJob Security" <notifications@tecjob.com>';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; }
          .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 36px 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .logo { font-size: 24px; font-weight: 900; color: #0f172a; margin-bottom: 24px; }
          .logo span { color: #2563eb; }
          .otp-box { background: #eff6ff; border: 2px dashed #93c5fd; border-radius: 12px; padding: 18px; text-align: center; margin: 24px 0; }
          .otp-code { font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #1d4ed8; font-family: monospace; }
          .btn { display: inline-block; background-color: #2563eb; color: #ffffff !important; font-weight: 700; text-decoration: none; padding: 12px 28px; border-radius: 10px; margin: 16px 0; }
          .footer { font-size: 12px; color: #94a3b8; text-align: center; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="logo">Tec<span>Job</span></div>
          <h2 style="color: #0f172a; margin: 0 0 12px;">Verify Your TecJob Account</h2>
          <p style="color: #475569; font-size: 14px; line-height: 1.6;">
            Hi ${name || 'there'},<br>
            Thank you for creating an account on TecJob! Please verify your email using the 6-digit code below:
          </p>
          
          <div class="otp-box">
            <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: #3b82f6; margin-bottom: 6px;">Your 6-Digit Code</div>
            <div class="otp-code">${otp}</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 6px;">Expires in 10 minutes</div>
          </div>

          <div style="text-align: center;">
            <p style="font-size: 13px; color: #64748b; margin-bottom: 8px;">Or click the instant verification button:</p>
            <a href="${magicLink}" class="btn">Verify Email Instantly →</a>
          </div>

          <p style="color: #94a3b8; font-size: 12px; line-height: 1.5; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
            If you did not sign up for TecJob, please ignore this email.
          </p>
          <div class="footer">
            © 2026 TecJob Inc. · Enterprise Recruitment Portal
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      if (!this.transporter) await this.initTransporter();

      const info = await this.transporter.sendMail({
        from,
        to,
        subject: `Your TecJob Verification Code: ${otp}`,
        html,
        text: `Your TecJob verification code is: ${otp}. It expires in 10 minutes. Or verify: ${magicLink}`,
      });

      let previewUrl: string | undefined;
      if (this.isTestAccount && nodemailer.getTestMessageUrl) {
        previewUrl = nodemailer.getTestMessageUrl(info) || undefined;
        this.logger.log(`Ethereal email preview available at: ${previewUrl}`);
      }

      return { success: true, previewUrl };
    } catch (err: any) {
      this.logger.error(`Failed to send email to ${to}: ${err.message}`);
      return { success: false };
    }
  }
}

