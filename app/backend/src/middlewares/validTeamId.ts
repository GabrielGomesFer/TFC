import { Request, Response, NextFunction } from 'express';
import TeamService from '../services/TeamService';

const teamService = new TeamService();

async function validTeamId(req: Request, res: Response, next: NextFunction) {
  const { homeTeam, awayTeam } = req.body;

  console.log('home', homeTeam);
  const isValidAway = await teamService.getTeamById(awayTeam);
  const isValidHome = await teamService.getTeamById(homeTeam);

  if (!isValidAway || !isValidHome) {
    return res.status(404).json({ message: 'There is no team with such id!' });
  }

  next();
}

export default validTeamId;
