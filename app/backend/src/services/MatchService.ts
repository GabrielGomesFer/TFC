import Match from '../database/models/Match.model';
import Team from '../database/models/Team.model';

export default class MatchService {
  public matchModel = Match;
  public teamModel = Team;

  public async getAllMatches() {
    const result = await this.matchModel.findAll({
      include: [
        { model: this.teamModel, as: 'teamHome', attributes: { exclude: ['id'] } },
        { model: this.teamModel, as: 'teamAway', attributes: { exclude: ['id'] } },
      ],
    });

    console.log('service Result', result);
    return result;
  }

  public async getMatchesInProgress(inProgress: boolean) {
    const result = await this.matchModel.findAll({
      where: { inProgress },
      include: [
        { model: this.teamModel, as: 'teamHome', attributes: { exclude: ['id'] } },
        { model: this.teamModel, as: 'teamAway', attributes: { exclude: ['id'] } },
      ],
    });

    return result;
  }
}
