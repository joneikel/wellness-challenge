import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/mongoose.config';
import { ChallengesModule } from './challenges/challenges.module';

@Module({
  imports: [UsersModule, DatabaseModule, ChallengesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
