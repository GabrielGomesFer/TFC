import * as sequelize from 'sequelize';
import Team from '../database/models/Team.model';
import Match from '../database/models/Match.model';
import leaderboardInterface from '../interfaces/leaderboardInterface';

const totalPoints = `SUM(home_team_goals < away_team_goals)
* 3 + SUM(home_team_goals = away_team_goals)`;
const efficiency = `CONVERT(((SUM(home_team_goals < away_team_goals) * 3) 
+ SUM(home_team_goals = away_team_goals)) / (COUNT(away_team_goals) * 3) * 100, DECIMAL(10,2))`;

class LeaderboardAwayService {
  private teamModel = Team;
  private matchodel = Match;

  public async getLeaderBoard(): Promise<leaderboardInterface[]> {
    const result = await this.matchodel.findAll({ where: { inProgress: false },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('away_team')), 'totalGames'],
        [sequelize.fn('SUM', sequelize.col('away_team_goals')), 'goalsFavor'],
        [sequelize.fn('SUM', sequelize.col('home_team_goals')), 'goalsOwn'],
        [sequelize.literal('SUM(away_team_goals) - SUM(home_team_goals)'), 'goalsBalance'],
        [sequelize.literal('SUM(away_team_goals > home_team_goals)'), 'totalVictories'],
        [sequelize.literal('SUM(away_team_goals = home_team_goals)'), 'totalDraws'],
        [sequelize.literal('SUM(away_team_goals < home_team_goals)'), 'totalLosses'],
        [sequelize.literal(`${totalPoints}`), 'totalPoints'],
        [sequelize.literal(`${efficiency}`), 'efficiency']],
      include: [{ model: this.teamModel, as: 'teamAway', attributes: ['teamName'] }],
      group: ['away_team'],
      order: [
        [sequelize.literal('totalPoints'), 'DESC'], [sequelize.literal('totalVictories'), 'DESC'],
        [sequelize.literal('goalsBalance'), 'DESC'], [sequelize.literal('goalsFavor'), 'DESC'],
        [sequelize.literal('goalsOwn'), 'ASC']] });
    return result as unknown as leaderboardInterface[];
  }

  public async correctLeaderBoard(): Promise<leaderboardInterface[]> {
    const leaderboard = await this.getLeaderBoard();

    const mappedLeaderboard = leaderboard.map((team) => ({
      name: (team.teamAway as unknown as leaderboardInterface).teamName,
      totalPoints: (team.dataValues as unknown as leaderboardInterface).totalPoints,
      totalGames: (team.dataValues as unknown as leaderboardInterface).totalGames,
      totalVictories: (team.dataValues as unknown as leaderboardInterface).totalVictories,
      totalDraws: (team.dataValues as unknown as leaderboardInterface).totalDraws,
      totalLosses: (team.dataValues as unknown as leaderboardInterface).totalLosses,
      goalsFavor: (team.dataValues as unknown as leaderboardInterface).goalsFavor,
      goalsOwn: (team.dataValues as unknown as leaderboardInterface).goalsOwn,
      goalsBalance: (team.dataValues as unknown as leaderboardInterface).goalsBalance,
      efficiency: (team.dataValues as unknown as leaderboardInterface).efficiency,
    }));

    return mappedLeaderboard as unknown as leaderboardInterface[];
  }
}
export default LeaderboardAwayService;
