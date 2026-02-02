import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import cookieSession from 'cookie-session';
import { UserDto } from './users/dtos/user.dto';
import { SerializeInterceptor } from './interceptors/serialize.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Cookie session middleware for authentication
  app.use(
    cookieSession({
      keys: ['momentum-secret-key'], // TODO: use environment variable
      // secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    }),
  );
  // Global interceptor to serialize all responses
  app.useGlobalInterceptors(new SerializeInterceptor(UserDto));
  // Global pipe to validate all incoming requests
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Momentum API')
    .setDescription('API for tracking habits and streaks')
    .setVersion('1.0')
    .addTag('habits')
    .addTag('streaks')
    .addTag('users')
    .addTag('analytics')
    .addTag('notifications')
    .addCookieAuth('session', {
      type: 'apiKey',
      in: 'cookie',
      name: 'session',
      description: 'Session cookie for authentication',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // Start the server
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
