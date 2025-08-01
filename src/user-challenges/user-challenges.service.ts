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

  // Obtener todos los retos activos de un usuario
  async getUserChallengesByUser(userId: string): Promise<UserChallenge[]> {
    const now = new Date();
    return this.userChallengeModel
      .find({
        userId,
        challengeId: { $exists: true },
      })
      .populate('challengeId') // Cargar datos del reto
      .exec();
  }

  // Actualizar progreso acumulativo
  async updateCumulativeProgress(
    userChallengeId: string,
    value: number,
    targetValue: number,
  ): Promise<void> {
    try {
      const uc = await this.userChallengeModel.findById(userChallengeId).exec();
      if (!uc || uc.completed) return; // No actualizar si ya completó
      const newCumulative = (uc.cumulativeValue || 0) + value;
      const progress = Math.min(
        Math.round((newCumulative / targetValue) * 100),
        100,
      );

      const update: any = {
        cumulativeValue: newCumulative,
        progress,
        activitiesCount: uc.activitiesCount,
        updatedAt: new Date(),
      };

      if (uc.progress !== progress) {
        update.activitiesCount = uc.activitiesCount + 1;
      }

      // Si alcanza el 100%, marcar como completado
      if (progress === 100 && !uc.completed) {
        update.completed = true;
        update.completedAt = new Date();
      }

      await this.userChallengeModel
        .updateOne({ _id: userChallengeId }, { $set: update })
        .exec();
    } catch (error) {
      console.error('updateCumulativeProgress: ', error);
      throw new HttpException(
        'Failed to update cumulative progress',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Actualizar progreso diario
  async updateDailyProgress(
    userChallengeId: string,
    date: Date,
    dailyGoalMet: boolean,
    requiredDays: number,
  ): Promise<void> {
    try {
      const uc = await this.userChallengeModel.findById(userChallengeId).exec();
      if (!uc || uc.completed) return;

      // Normalizar la fecha (sin hora) para comparar
      const normalizedDate = new Date(date);
      normalizedDate.setHours(0, 0, 0, 0);

      // Buscar si ya existe una entrada para esta fecha
      const existingIndex = uc.dailyProgress?.findIndex(
        (dp) =>
          new Date(dp.date).toDateString() === normalizedDate.toDateString(),
      );

      let newDailyProgress = [...(uc.dailyProgress || [])];

      if (existingIndex >= 0) {
        // Si ya existe, actualizar
        if (newDailyProgress[existingIndex].achieved === dailyGoalMet) {
          return; // No hay cambios
        }
        newDailyProgress[existingIndex] = {
          date: normalizedDate,
          achieved: dailyGoalMet,
        };
      } else {
        // Si no existe, agregar
        newDailyProgress.push({ date: normalizedDate, achieved: dailyGoalMet });
      }

      const daysAchieved = newDailyProgress.filter((dp) => dp.achieved).length;
      const progress = Math.min(
        Math.round((daysAchieved / requiredDays) * 100),
        100,
      );

      const update: any = {
        dailyProgress: newDailyProgress,
        progress,
        $inc: { activitiesCount: 1 },
        updatedAt: new Date(),
      };

      if (progress === 100 && !uc.completed) {
        update.completed = true;
        update.completedAt = new Date();
      }

      await this.userChallengeModel
        .updateOne({ _id: userChallengeId }, { $set: update })
        .exec();
    } catch (error) {
      console.error('updateDailyProgress: ', error);
      throw new HttpException(
        'Failed to update daily progress',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // Incrementar contador de actividades
  async incrementActivitiesCount(userChallengeId: string): Promise<void> {
    try {
      await this.userChallengeModel
        .updateOne(
          { _id: userChallengeId },
          { $inc: { activitiesCount: 1 }, updatedAt: new Date() },
        )
        .exec();
    } catch (error) {
      console.error('incrementActivitiesCount: ', error);
      throw new HttpException(
        'Failed to increment activities count',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Obtener la lista de retos del usuario con detalles
  async getUserChallengesWithDetails(userId: string): Promise<any[]> {
    // Validar que el usuario exista
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Obtener todos los UserChallenges del usuario
    const userChallenges = await this.userChallengeModel
      .find({ userId })
      .populate('challengeId', 'name type startDate endDate') // Cargar solo campos necesarios
      .exec();

    // Mapear a una respuesta limpia
    return userChallenges.map((uc: any) => ({
      challenge: {
        name: uc.challengeId.name,
        type: uc.challengeId.type,
        startDate: uc.challengeId.startDate,
        endDate: uc.challengeId.endDate,
      },
      progress: uc.progress,
      completed: uc.completed,
      completedAt: uc.completedAt,
      activitiesCount: uc.activitiesCount,
      joinedAt: uc.joinedAt,
    }));
  }
}
