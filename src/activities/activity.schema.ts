import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'DailyActivities' })
export class DailyActivity extends Document {
  @Prop({ required: true, ref: 'User' })
  userId: string;

  @Prop({ required: true })
  date: Date;

  @Prop()
  steps?: number;

  @Prop()
  sleep?: number;

  @Prop()
  cardioPoints?: number;

  @Prop({ default: Date.now })
  updatedAt?: Date;

  @Prop({ default: Date.now })
  createdAt?: Date;
}

export const ActivitySchema = SchemaFactory.createForClass(DailyActivity);

// Índice único: un usuario solo puede tener un registro por día
ActivitySchema.index({ userId: 1, date: 1 }, { unique: true });
