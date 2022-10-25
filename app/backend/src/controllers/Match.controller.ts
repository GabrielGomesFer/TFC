import { Request, Response } from 'express';
import MatchService from '../services/MatchService';

export default class MatchController {
  constructor(private matchService = new MatchService()) {}

  public getAllMatches = async (req: Request, res: Response) => {
    const { inProgress } = req.query;

    console.log('controller entrou');
    if (inProgress) {
      const matchInProgress = await this.matchService.getMatchesInProgress(inProgress === 'true');
      console.log('matchInP COntroller', matchInProgress);
      return res.status(200).json(matchInProgress);
    }

    const result = await this.matchService.getAllMatches();
    return res.status(200).json(result);
  };
}
