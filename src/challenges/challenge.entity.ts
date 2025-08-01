export interface Challenge {
  _id: string;
  name: string;
  type: 'steps' | 'sleep' | 'cardio_points';
  startDate: Date;
  endDate: Date;
  goalType: 'cumulative' | 'daily';
  targetValue: number;
  requiredDays?: number;
  createdAt?: Date;
}
