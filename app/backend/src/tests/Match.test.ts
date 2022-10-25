import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Match from '../database/models/Match.model';

import { Response } from 'superagent';

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

//   describe('Teste POST /matches', () => {
//     beforeEach(sinon.restore);
//   })
});
