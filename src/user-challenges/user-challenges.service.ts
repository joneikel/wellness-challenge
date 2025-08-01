import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserChallenge } from './user-challenge.entity';
import { UsersService } from '../users/users.service';
import { ChallengesService } from '../challenges/challenges.service';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class UserChallengesService {
  constructor(
    @InjectModel('UserChallenge')
    private readonly userChallengeModel: Model<UserChallenge>,
    private readonly usersService: UsersService,
    private readonly challengesService: ChallengesService,
  ) {}

  async joinChallenge(
    userId: string,
    challengeId: string,
  ): Promise<UserChallenge> {
    // Validar que el usuario exista
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Validar que el reto exista
    const challenge =
      await this.challengesService.getChallengeById(challengeId);
    if (!challenge) {
      throw new HttpException('Challenge not found', HttpStatus.NOT_FOUND);
    }

    // Validar que el reto esté activo (fecha actual dentro del rango)
    const now = new Date();
    if (now < challenge.startDate || now > challenge.endDate) {
      throw new HttpException(
        'The challenge is not active',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validar que el usuario no esté ya inscrito
    const existing = await this.userChallengeModel
      .findOne({
        userId,
        challengeId,
      })
      .exec();

    if (existing) {
      throw new HttpException(
        'User is already enrolled in this challenge',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Crear nuevo registro de participación
    const newEnrollment = new this.userChallengeModel({
      userId,
      challengeId,
      joinedAt: new Date(),
      completed: false,
      progress: 0,
      cumulativeValue: challenge.goalType === 'cumulative' ? 0 : undefined,
      dailyProgress: challenge.goalType === 'daily' ? [] : undefined,
      activitiesCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    try {
      return await newEnrollment.save();
    } catch (error) {
      console.error('user-challenges.ervice ', error);
      // Capturar errores de base de datos (ej: caída de conexión, timeout)
      throw new HttpException(
        'Failed to enroll user due to a server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
