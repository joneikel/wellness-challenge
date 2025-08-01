import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'UserChallenges' }) 
export class UserChallenge extends Document {
  @Prop({ required: true, ref: 'User' })
  userId: string;

  @Prop({ required: true, ref: 'Challenge' })
  challengeId: string;

  @Prop({ required: true, default: Date.now })
  joinedAt: Date;

  @Prop({ default: false })
  completed: boolean;

  @Prop()
  completedAt?: Date;

  @Prop({ default: 0 })
  progress: number;

  @Prop({ default: 0 })
  cumulativeValue?: number;

  @Prop({ default: () => [] })
  dailyProgress?: {
    date: Date;
    achieved: boolean;
  }[];

  @Prop({ default: 0 })
  activitiesCount: number;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updatedAt?: Date;
}

export const UserChallengeSchema = SchemaFactory.createForClass(UserChallenge);

// Índice único: un usuario solo puede unirse una vez a un reto
UserChallengeSchema.index({ userId: 1, challengeId: 1 }, { unique: true });
