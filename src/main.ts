import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe());
  // app.use(JwtMiddleware); // only for functional middleware
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
