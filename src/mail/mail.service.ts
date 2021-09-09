import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService
  ) {}

  async sendAuthConfirmation(email: string, token: string) {
    const protocol = this.configService.get('SERVER_PROTOCOL');
    const host = this.configService.get('SERVER_HOST');
    const port = this.configService.get('SERVER_PORT');
    const link = `${protocol}://${host}:${port}/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Подтвердите свой адрес электронной почты.',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: {
        name: email,
        link,
      },
    });
  }

  async sendRestorePassword(email: string, token: string) {
    const protocol = this.configService.get('SERVER_PROTOCOL');
    const host = this.configService.get('SERVER_HOST');
    const port = this.configService.get('SERVER_PORT');
    const link = `${protocol}://${host}:${port}/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Смена пароля аккаунта.',
      template: './restorePassword', // `.hbs` extension is appended automatically
      context: {
        name: email,
        link,
      },
    });  
  }
}

  