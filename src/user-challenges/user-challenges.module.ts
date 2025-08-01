import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserChallengesController } from './user-challenges.controller';
import { UserChallengesService } from './user-challenges.service';
import { UserChallengeSchema } from './user-challenge.schema';
import { UsersModule } from '../users/users.module';
import { ChallengesModule } from '../challenges/challenges.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'UserChallenge', schema: UserChallengeSchema },
    ]),
    UsersModule,
    ChallengesModule,
  ],
  controllers: [UserChallengesController],
  providers: [UserChallengesService],
  exports: [UserChallengesService],
})
export class UserChallengesModule {}
