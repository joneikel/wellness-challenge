export interface UserChallenge {
  _id: string;
  userId: string;
  challengeId: string;
  joinedAt: Date;
  completed: boolean;
  completedAt?: Date;
  progress: number;
  cumulativeValue?: number;
  dailyProgress?: {
    date: Date;
    achieved: boolean;
  }[];
  activitiesCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}