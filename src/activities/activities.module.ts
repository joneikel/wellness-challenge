import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { ActivitySchema } from './activity.schema';
import { UsersModule } from '../users/users.module';
import { UserChallengesModule } from '../user-challenges/user-challenges.module';
import { ChallengesModule } from '../challenges/challenges.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'DailyActivity', schema: ActivitySchema }]),
    UsersModule,
    UserChallengesModule,
    ChallengesModule,
  ],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
})
export class ActivitiesModule {}