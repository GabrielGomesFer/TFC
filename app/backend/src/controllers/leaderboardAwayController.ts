import { Request, Response } from 'express';
import LeaderboardAwayService from '../services/LeaderboardAwayService';
import 'dotenv/config';

class LeaderboardController {
  constructor(private leaderboardService = new LeaderboardAwayService()) {}
  public getLeaderboard = async (req: Request, res: Response) => {
    const result = await this.leaderboardService.correctLeaderBoard();

    console.log('chamou leaderboard');
    return res.status(200).json(result);
  };
}

export default LeaderboardController;
