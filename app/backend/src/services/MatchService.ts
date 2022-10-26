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

  public async createMatch(
    homeTeam: number,
    awayTeam: number,
    homeTeamGoals: number,
    awayTeamGoals: number,
  ) {
    const result = await this.matchModel.create({
      homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress: true,
    });

    return result;
  }

  public async finishMatch(id: string) {
    await this.matchModel.update({ inProgress: false }, { where: { id } });
  }

  public async updateMatchGoals(id: string, homeTeamGoals: number, awayTeamGoals: number) {
    await this.matchModel.update({
      homeTeamGoals, awayTeamGoals,
    }, { where: { id } });
  }
}
