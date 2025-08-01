import { Test, TestingModule } from '@nestjs/testing';
import { UserChallengesController } from './user-challenges.controller';

describe('UserChallengesController', () => {
  let controller: UserChallengesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserChallengesController],
    }).compile();

    controller = module.get<UserChallengesController>(UserChallengesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
