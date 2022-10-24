import TeamModel from '../database/models/Team.model';
import { teamInterface } from '../interfaces/teamInterface';

class TeamService {
  private model = TeamModel;

  public async getAll(): Promise<teamInterface> {
    const result = await this.model.findAll() as unknown as teamInterface;

    return result;
  }

  public getTeamById = async (id: string): Promise<teamInterface | null> => {
    const result = await this.model.findOne({ where: { id } });
    // console.log('Result service', result);
    return result;
  };
}
export default TeamService;
