export interface RankOrderItem {
  id: string;
  content: string;
  imageUrl?: string;
  correctOrder: number;
}

export interface RankOrderGameData {
  title: string;
  description: string;
  items: RankOrderItem[];
  timeLimit?: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface RankOrderSubmission {
  userOrder: string[]; // array of item IDs in user's order
  timeSpent: number;
}

export interface RankOrderResult {
  isCorrect: boolean;
  score: number;
  correctOrder: string[];
  userOrder: string[];
}
