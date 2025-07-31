export interface UserChallenge {
  _id: string;
  userId: string;
  challengeId: string;
  joinedAt: Date;
  completed: boolean;
  completedAt?: Date;
  progress: number;
  cumulativeValue?: number; // Solo para metas acumulativas
  dailyProgress?: {
    date: Date;
    achieved: boolean;
  }[]; // Solo para metas diarias
  createdAt?: Date;
  updatedAt?: Date;
}