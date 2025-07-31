export interface DailyActivity {
  _id: string;
  userId: string;
  date: Date;
  steps?: number;
  sleep?: number;
  cardioPoints?: number;
  updatedAt?: Date;
  createdAt?: Date;
}