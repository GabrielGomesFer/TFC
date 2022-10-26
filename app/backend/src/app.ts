import * as express from 'express';
import UserController from './controllers/User.controller';
import loginAut from './middlewares/authentication';
import TeamController from './controllers/Team.controller';
import MatchController from './controllers/Match.controller';
import validTeamId from './middlewares/validTeamId';
import validTokenAut from './middlewares/validTokenAut';

const userController = new UserController();
const teamController = new TeamController();
const matchController = new MatchController();

class App {
  public app: express.Express;

  constructor() {
    this.app = express();

    this.config();

    // /Login endpoint
    this.app.post('/login', loginAut, userController.login);
    this.app.get('/login/validate', userController.validateRole);

    // /Teams endpoint
    this.app.get('/teams', teamController.allTeams);
    this.app.get('/teams/:id', teamController.teamById);

    // /Matches endpoint
    this.app.get('/matches', matchController.getAllMatches);
    this.app.post('/matches', validTokenAut, validTeamId, matchController.createMatch);
    this.app.patch('/matches/:id/finish', matchController.finishMatch);
    // Não remover essa rota
    this.app.get('/', (req, res) => res.json({ ok: true }));
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(express.json());
    this.app.use(accessControl);
  }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
