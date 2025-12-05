import type { SlidingPuzzle, PuzzleScore } from '../types/slidingPuzzle.types';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export const slidingPuzzleApi = {
  async getAllPuzzles(): Promise<SlidingPuzzle[]> {
    const res = await fetch(`${API_URL}/sliding-puzzle`);
    const data = await res.json();
    return data.data;
  },

  async getPuzzleById(id: string): Promise<SlidingPuzzle> {
    const res = await fetch(`${API_URL}/sliding-puzzle/${id}`);
    const data = await res.json();
    return data.data;
  },

  async submitScore(puzzleId: string, playerName: string, moves: number, timeSpent: number): Promise<PuzzleScore> {
    const res = await fetch(`${API_URL}/sliding-puzzle/${puzzleId}/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerName, moves, timeSpent, completed: true }),
    });
    const data = await res.json();
    return data.data;
  },

  async getLeaderboard(puzzleId: string): Promise<PuzzleScore[]> {
    const res = await fetch(`${API_URL}/sliding-puzzle/${puzzleId}/leaderboard`);
    const data = await res.json();
    return data.data;
  },
};