// src/user-challenges/user-challenge.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class UserChallenge extends Document {
  @Prop({ required: true, ref: 'User' }) // Referencia al modelo User
  userId: string;

  @Prop({ required: true, ref: 'Challenge' }) // Referencia al modelo Challenge
  challengeId: string;

  @Prop({ default: Date.now })
  joinedAt: Date;

  @Prop({ default: false })
  completed: boolean;

  @Prop()
  completedAt?: Date;

  @Prop({ default: 0 })
  progress: number;

  @Prop()
  cumulativeValue?: number; // Solo para metas acumulativas

  @Prop()
  dailyProgress?: {
    date: Date;
    achieved: boolean;
  }[]; // Solo para metas diarias

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updatedAt?: Date;
}

export const UserChallengeSchema = SchemaFactory.createForClass(UserChallenge);