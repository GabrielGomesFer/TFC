import * as sinon from 'sinon';
import * as chai from 'chai';
import * as jwt from 'jsonwebtoken';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Match from '../database/models/Match.model';

import { Response } from 'superagent';
import User from '../database/models/User.Model';
import { JsonWebTokenError } from 'jsonwebtoken';
import { validToken } from './mocks/token';

chai.use(chaiHttp);

const { expect } = chai;

describe('/matches', () => {

  let chaiHttpResponse: Response;

  
  describe('Teste GET /matches', () =>{

    const mockedMatches = [
        {
          id: 1,
          homeTeam: 16,
          homeTeamGoals: 1,
          awayTeam: 8,
          awayTeamGoals: 1,
          inProgress: false,
          teamHome: {
            teamName: "São Paulo"
          },
          teamAway: {
            teamName: "Grêmio"
          }        },
        {
          id: 2,
          homeTeam: 16,
          homeTeamGoals: 2,
          awayTeam: 9,
          awayTeamGoals: 0,
          inProgress: true,
          teamHome: {
            teamName: "São Paulo"
          },
          teamAway: {
            teamName: "Internacional"
          }
        }
      ] as unknown;

    beforeEach(async () => {
    sinon
    .stub(Match, "findAll")
    .resolves(mockedMatches as Match[]);
    });
    
    afterEach(()=>sinon.restore());


    it('testa se traz todas as partidas com sucesso', async () => {
    const httpResponse = await chai
    .request(app)
    .get('/matches')
    
    expect(httpResponse.status).to.be.equal(200);
    expect(httpResponse.body).to.be.deep.equal(mockedMatches);
    });
  })

  describe('teste GET /matches?inProgress=', () => {
    const finishedMock = [
        {
          id: 1,
          homeTeam: 16,
          homeTeamGoals: 1,
          awayTeam: 8,
          awayTeamGoals: 1,
          inProgress: false,
          teamHome: {
            teamName: "São Paulo"
          },
          teamAway: {
            teamName: "Grêmio"
          }        } ]
          
    const inProgressMock = [      
        {
          id: 2,
          homeTeam: 16,
          homeTeamGoals: 2,
          awayTeam: 9,
          awayTeamGoals: 0,
          inProgress: true,
          teamHome: {
            teamName: "São Paulo"
          },
          teamAway: {
            teamName: "Internacional"
          }
        }
      ] as unknown;

      afterEach(() => sinon.restore());

      it('/matches?inProgress=false',async () => {
        sinon.stub(Match, "findAll").resolves(finishedMock as unknown as Match[])

        const httpResponse = await chai.request(app)
        .get('/matches?inProgress=false')

        expect(httpResponse.status).to.be.equal(200);
        expect(httpResponse.body).to.be.deep.equal(finishedMock);
      })

      it('/matches?inProgress=true',async () => {
        sinon.stub(Match, "findAll").resolves(inProgressMock as unknown as Match[])

        const httpResponse = await chai.request(app)
        .get('/matches?inProgress=true')

        expect(httpResponse.status).to.be.equal(200);
        expect(httpResponse.body).to.be.deep.equal(inProgressMock);
      })
  })

  describe('Teste POST /matches', () => {
    const mockedCreatedMatch = {
      id: 49,
      homeTeam: 8,
      awayTeam: 1,
      homeTeamGoals: 2,
      awayTeamGoals: 2,
      inProgress: true
    }
    beforeEach(async () => {
      sinon
        .stub(User, "findOne")
        .resolves({
          id: 2,
          username: 'User',
          role: 'user',
          email: 'user@user.com',
          password: '$2a$08$Y8Abi8jXvsXyqm.rmp0B.uQBA5qUz7T6Ghlg/CvVr/gLxYj5UAZVO',
        } as User);

        const loggedUser = await chai
        .request(app)
        .post('/login')
        .send({ email: 'admin@admin.com', password: 'secret_admin' });

        sinon.stub(Match, "create").resolves(mockedCreatedMatch as Match);
    });

    afterEach(() => sinon.restore())

    it('testa cadastrar partida com sucesso',async () => {
      sinon.stub(jwt, 'verify').resolves(true);

      const httpResponse = await chai.request(app)
      .post("/matches")
      .send({
          homeTeam: 8,
          awayTeam: 3,
          homeTeamGoals: 2,
          awayTeamGoals: 2,
      })
      .set("Authorization", validToken);

      expect(httpResponse.status).to.be.equal(201);
      expect(httpResponse.body).to.be.deep.equal(mockedCreatedMatch);
      
    })
    
    it('testa cadastrar partida sem o token',async () => {
      const httpResponse = await chai.request(app)
      .post("/matches")
      .send({
          homeTeam: 8,
          awayTeam: 3,
          homeTeamGoals: 2,
          awayTeamGoals: 2,
      });

      expect(httpResponse.status).to.be.equal(401);
      expect(httpResponse.body).to.be.deep.equal({ message: "Token must be a valid token"  });

    })

    it('testa cadastrar partida com token invalido',async () => {
      sinon.stub(jwt, 'verify').throws();

      const httpResponse = await chai.request(app)
      .post("/matches")
      .send({
          homeTeam: 8,
          awayTeam: 3,
          homeTeamGoals: 2,
          awayTeamGoals: 2,
      })
      .set("Authorization", validToken);

      expect(httpResponse.status).to.be.equal(401);
      expect(httpResponse.body).to.be.deep.equal({ message: "Token must be a valid token"  });

    })

    it('testa cadastrar partida com 2 times iguais',async () => {
      sinon.stub(jwt, 'verify').resolves(true);

      const httpResponse = await chai.request(app)
      .post("/matches")
      .send({
          homeTeam: 8,
          awayTeam: 8,
          homeTeamGoals: 2,
          awayTeamGoals: 2,
      })
      .set("Authorization", validToken);

      expect(httpResponse.status).to.be.equal(422);
      expect(httpResponse.body).to.be.deep.equal({ message: "It is not possible to create a match with two equal teams"  });

    })
  })

  describe('Teste PATCH /matches/:id/finish', () => {
    beforeEach(() => sinon.restore())

    it('finaliza com sucesso uma partida inProgress',async () => {
      sinon.stub(Match, "update");

      const httpResponse = await chai.request(app)
      .patch('/matches/:id/finish');

      expect(httpResponse.status).to.be.equal(200);
      expect(httpResponse.body).to.be.deep.equal({ message: "Finished" })
    })
  })

  describe('Teste PATCH /matches', () => {
    beforeEach(() => sinon.restore())

    it('atualiza com sucesso os gols de uma partida',async () => {
      sinon.stub(Match, "update");

      const httpResponse = await chai.request(app)
      .patch('/matches/:id')
      .send({
        homeTeamGoals: 3,
        awayTeamGoals: 1
      });

      expect(httpResponse.status).to.be.equal(200);
      expect(httpResponse.body).to.be.deep.equal({ message: "Updated" })
    })
  })
});
