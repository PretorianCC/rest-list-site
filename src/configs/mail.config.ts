import { ConfigService } from "@nestjs/config";
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { path } from 'app-root-path';

export const getMailConfig = async (config: ConfigService) => ({
  transport: {
    host: config.get('MAIL_HOST'),
    secure: false,
    auth: {
      user: config.get('MAIL_USER'),
      pass: config.get('MAIL_PASSWORD'),
    },
  },
  defaults: {
    from: `"No Reply" <${config.get('MAIL_FROM')}>`,
  },
  template: {
    dir: `${path}/dist/mail/templates`,
    adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
    options: {
      strict: true,
    },
  },
});