import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { path } from 'app-root-path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  app.useStaticAssets(`${path}/public`);
  app.setBaseViewsDir(`${path}/views`);
  app.setViewEngine('hbs');
  await app.listen(3000);
}
bootstrap();
