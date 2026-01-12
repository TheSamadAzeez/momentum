import { Controller, Get, Session, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('analytics')
@UseGuards(AuthGuard)
export class AnalyticsController {
  @Get('/summary')
  getAnalyticsSummary(@Session() session: { userId: string }) {
    return `Analytics summary for user ${session.userId}`;
  }
}
