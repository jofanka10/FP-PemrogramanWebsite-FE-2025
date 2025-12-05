export interface SlidingPuzzle {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string;
    gridSize: number;
    difficulty: string;
    category: string;
    isActive: boolean;
  }
  
  export interface PuzzleScore {
    id: string;
    puzzleId: string;
    playerName: string;
    moves: number;
    timeSpent: number;
    completed: boolean;
    createdAt: string;
  }
  
  export interface Tile {
    id: number;
    position: number;
    imagePosition: number;
    isEmpty: boolean;
  }