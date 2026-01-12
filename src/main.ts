import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import cookieSession from 'cookie-session';
import { UserDto } from './users/dtos/user.dto';
import { SerializeInterceptor } from './interceptors/serialize.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      keys: ['momentum-secret-key'], // TODO: use environment variable
      // secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 day TODO: change to 7 days
    }),
  );
  app.useGlobalInterceptors(new SerializeInterceptor(UserDto));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
