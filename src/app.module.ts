import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import databaseConfig from './database/database.config';
import { UserSessionMiddleware } from './middleware/user-session.middleware';
import { HabitsModule } from './habits/habits.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { StreakModule } from './streak/streak.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    DatabaseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        host: configService.get('database.host')!,
        port: configService.get('database.port')!,
        user: configService.get('database.user')!,
        password: configService.get('database.password')!,
        database: configService.get('database.database')!,
      }),
    }),
    UsersModule,
    HabitsModule,
    AnalyticsModule,
    StreakModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserSessionMiddleware)
      .exclude('user/auth/(.*)')
      .forRoutes('*');
  }
}
