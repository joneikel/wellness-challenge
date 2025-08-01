import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Challenge } from './challenge.entity';
import { CreateChallengeDto } from './dto/create-challenge.dto';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
  ) {}

  async createChallenge(dto: CreateChallengeDto): Promise<Challenge> {
    const challenge = new this.challengeModel(dto);
    return challenge.save();
  }

  async getAllChallenges(): Promise<Challenge[]> {
    return this.challengeModel.find().exec();
  }

  async getChallengeById(id: string): Promise<Challenge> {
    return this.challengeModel.findById(id).exec();
  }

  // Retos activos: fecha actual entre startDate y endDate
  async getActiveChallenges(): Promise<Challenge[]> {
    const now = new Date();
    return this.challengeModel
      .find({
        startDate: { $lte: now },
        endDate: { $gte: now },
      })
      .exec();
  }
}
