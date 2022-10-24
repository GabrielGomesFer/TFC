import { Request, Response } from 'express';
import TeamService from '../services/TeamService';
import 'dotenv/config';

class TeamController {
  constructor(private teamService = new TeamService()) {}
  public allTeams = async (req: Request, res: Response) => {
    const teams = await this.teamService.getAll();

    console.log('chamou');
    return res.status(200).json(teams);
  };

  public teamById = async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await this.teamService.getTeamById(id);
    if (!result) {
      return res.status(404).json({ message: 'Team not found.' });
    }

    return res.status(200).json(result);
  };
}

export default TeamController;
