import { Request, Response } from 'express';
import MatchService from '../services/MatchService';

export default class MatchController {
  constructor(private matchService = new MatchService()) {}

  public getAllMatches = async (req: Request, res: Response) => {
    const { inProgress } = req.query;

    console.log('controller entrou');
    if (inProgress) {
      const matchInProgress = await this.matchService.getMatchesInProgress(inProgress === 'true');
      return res.status(200).json(matchInProgress);
    }

    const result = await this.matchService.getAllMatches();
    return res.status(200).json(result);
  };

  public createMatch = async (req:Request, res: Response) => {
    const { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals } = req.body;

    if (homeTeam === awayTeam) {
      return res.status(422).json({
        message: 'It is not possible to create a match with two equal teams',
      });
    }

    const result = await this.matchService.createMatch(
      homeTeam,
      awayTeam,
      homeTeamGoals,
      awayTeamGoals,
    );

    return res.status(201).json(result);
  };

  public finishMatch = async (req: Request, res: Response) => {
    const { id } = req.params;

    await this.matchService.finishMatch(id);

    return res.status(200).json({ message: 'Finished' });
  };
}
