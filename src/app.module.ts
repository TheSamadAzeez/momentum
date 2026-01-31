import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import databaseConfig from './database/database.config';
import { UserSessionMiddleware } from './middleware/user-session.middleware';
import { HabitsModule } from './habits/habits.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { StreakModule } from './streak/streak.module';
import { NotificationModule } from './notification/notification.module';
// import { CacheModule } from '@nestjs/cache-manager';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
      // defaultJobOptions: { attempts: 3 },
    }),
    // CacheModule.register({
    //   max: 100, // max number of items in cache i.e. 100 habits can be stored in cache at a time
    //   isGlobal: true,
    //   ttl: 60 * 60 * 1000, // 1 hour
    // }),
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
    NotificationModule,
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
