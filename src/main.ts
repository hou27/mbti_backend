import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AppDataSource } from './data-source';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  AppDataSource.initialize()
    .then()
    .catch((e) => console.log(e));
  // app.use(JwtMiddleware); // only for functional middleware
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
