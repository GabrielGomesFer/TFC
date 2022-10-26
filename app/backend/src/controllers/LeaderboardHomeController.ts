import { Request, Response } from 'express';
import LeaderboardHomeService from '../services/LeaderboardHomeService';
import 'dotenv/config';

class LeaderboardController {
  constructor(private leaderboardService = new LeaderboardHomeService()) {}
  public getLeaderboard = async (req: Request, res: Response) => {
    const result = await this.leaderboardService.correctLeaderBoard();

    console.log('chamou leaderboard');
    return res.status(200).json(result);
  };
}

export default LeaderboardController;
