import { Request, Response, NextFunction } from 'express';
import { RankOrderService } from './rank-order.service.js';
import { IRankOrderGameData, IRankOrderSubmission } from '../../../../common/interface/games/rank-order.interface.js';

export class RankOrderController {
  static async validateGame(
    req: Request<{}, {}, { gameData: IRankOrderGameData }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const isValid = RankOrderService.validateGameData(req.body.gameData);
      res.json({ success: true, valid: isValid });
    } catch (error) {
      next(error);
    }
  }

  static async submitAnswer(
    req: Request<{}, {}, { gameData: IRankOrderGameData; submission: IRankOrderSubmission }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = RankOrderService.checkAnswer(req.body.gameData, req.body.submission);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  // TAMBAHKAN INI untuk create game
  static async createGame(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // Game data sudah di-handle oleh sistem WordIT
      // Kita hanya perlu return success
      res.json({ 
        success: true, 
        message: 'Rank Order game created successfully',
        data: req.body
      });
    } catch (error) {
      next(error);
    }
  }
}