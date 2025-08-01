import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'Challenges' })
export class Challenge extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['steps', 'sleep', 'cardio_points'] })
  type: 'steps' | 'sleep' | 'cardio_points';

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true, enum: ['cumulative', 'daily'] })
  goalType: 'cumulative' | 'daily';

  @Prop({ required: true })
  targetValue: number;

  @Prop()
  requiredDays?: number;

  @Prop({ default: Date.now })
  createdAt?: Date;
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);
