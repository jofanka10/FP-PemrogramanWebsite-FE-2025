import { IRankOrderGameData, IRankOrderSubmission } from '../../../../common/interface/games/rank-order.interface.js';

export class RankOrderService {
  static validateGameData(gameData: IRankOrderGameData): boolean {
    // Validasi bahwa setiap item memiliki correctOrder yang unik
    const orders = gameData.items.map(item => item.correctOrder);
    const uniqueOrders = new Set(orders);
    
    if (orders.length !== uniqueOrders.size) {
      throw new Error('Each item must have a unique correctOrder');
    }

    // Validasi bahwa correctOrder berurutan dari 1
    const sortedOrders = [...orders].sort((a, b) => a - b);
    for (let i = 0; i < sortedOrders.length; i++) {
      if (sortedOrders[i] !== i + 1) {
        throw new Error('correctOrder must be sequential starting from 1');
      }
    }

    return true;
  }

  static checkAnswer(gameData: IRankOrderGameData, submission: IRankOrderSubmission) {
    // Get correct order
    const correctOrder = gameData.items
      .sort((a, b) => a.correctOrder - b.correctOrder)
      .map(item => item.id);

    // Check if user order matches correct order
    const isCorrect = JSON.stringify(correctOrder) === JSON.stringify(submission.userOrder);

    // Calculate score (bonus for speed)
    let score = 0;
    if (isCorrect) {
      const baseScore = 1000;
      const timeBonus = gameData.timeLimit 
        ? Math.max(0, (gameData.timeLimit - submission.timeSpent) * 10)
        : 0;
      score = Math.floor(baseScore + timeBonus);
    }

    return {
      isCorrect,
      score,
      correctOrder,
      userOrder: submission.userOrder,
    };
  }
}
