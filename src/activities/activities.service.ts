// src/activities/activities.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateActivityDto } from './dto/create-activity.dto';
import { DailyActivity } from './activity.entity';
import { UsersService } from '../users/users.service';
import { UserChallengesService } from '../user-challenges/user-challenges.service';
import { ChallengesService } from '../challenges/challenges.service';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectModel('DailyActivity')
    private readonly activityModel: Model<DailyActivity>,
    private readonly usersService: UsersService,
    private readonly userChallengesService: UserChallengesService,
    private readonly challengesService: ChallengesService,
  ) {}

  async createActivity(dto: CreateActivityDto): Promise<DailyActivity> {
    // Validar que el usuario exista
    const user = await this.usersService.getUserById(dto.userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Validar fecha no futura
    if (!dto.validateDate()) {
      throw new HttpException(
        'Cannot register activity for future dates',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validar que al menos un campo de actividad esté presente
    if (
      dto.steps === undefined &&
      dto.sleep === undefined &&
      dto.cardioPoints === undefined
    ) {
      throw new HttpException(
        'At least one activity field (steps, sleep, cardioPoints) must be provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Preparar campos para acumulación
    const updateFields: any = { updatedAt: new Date() };
    if (dto.steps !== undefined) updateFields['$inc'] = { steps: dto.steps };
    if (dto.sleep !== undefined)
      updateFields['$set'] = { ...updateFields['$set'], sleep: dto.sleep };
    if (dto.cardioPoints !== undefined) {
      updateFields['$inc'] = {
        ...updateFields['$inc'],
        cardioPoints: dto.cardioPoints,
      };
    }

    // Operación atómica: upsert con acumulación
    let activity: DailyActivity;
    try {
      activity = await this.activityModel
        .findOneAndUpdate(
          { userId: dto.userId, date: dto.date },
          updateFields,
          { upsert: true, new: true, setDefaultsOnInsert: true },
        )
        .exec();
    } catch (error) {
      console.error('createActivity: ', error);
      throw new HttpException(
        'Failed to register activity',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // Disparar actualización de progreso en retos activos
    await this.updateUserChallengeProgress(dto.userId, dto.date, dto.steps);

    return activity;
  }

  private async updateUserChallengeProgress(
    userId: string,
    activityDate: Date,
    steps: number,
  ) {
    // Obtener todos los UserChallenges activos del usuario
    const userChallenges =
      await this.userChallengesService.getUserChallengesByUser(userId);
    const now = new Date();

    for (const uc of userChallenges) {
      const challenge = await this.challengesService.getChallengeById(
        uc.challengeId,
      );

      // Validar que el reto esté activo y que la fecha de actividad esté dentro del rango
      if (now < challenge.startDate || now > challenge.endDate) continue;
      if (
        activityDate < challenge.startDate ||
        activityDate > challenge.endDate
      )
        continue;

      // Solo procesar si el tipo coincide
      if (
        challenge.type !== 'steps' &&
        challenge.type !== 'sleep' &&
        challenge.type !== 'cardio_points'
      )
        continue;

      // Obtener la actividad del día para este tipo
      const activity = await this.activityModel
        .findOne({
          userId,
          date: activityDate,
        })
        .exec();

      if (!activity) continue;
      let value: number | undefined;
      if (challenge.type === 'steps') value = steps;
      else if (challenge.type === 'sleep') value = activity.sleep;
      else if (challenge.type === 'cardio_points')
        value = activity.cardioPoints;

      if (value === undefined || value < 0) continue;

      // Actualizar progreso según el tipo de meta
      if (challenge.goalType === 'cumulative') {
        await this.userChallengesService.updateCumulativeProgress(
          uc._id,
          value,
          challenge.targetValue,
        );
      } else if (challenge.goalType === 'daily') {
        const dailyGoalMet = value >= challenge.targetValue;
        await this.userChallengesService.updateDailyProgress(
          uc._id,
          activityDate,
          dailyGoalMet,
          challenge.requiredDays,
        );
      }
    }
  }
}
