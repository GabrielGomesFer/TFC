import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Team from '../database/models/Team.model';
import { teamsMock, teamIdMock } from './mocks/teamsMock';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('/TEAMS', () => {

  let chaiHttpResponse: Response;

  
  describe('Teste GET /teams', () =>{
    beforeEach(async () => {
    sinon
    .stub(Team, "findAll")
    .resolves(teamsMock as Team[]);
    });
    
    afterEach(()=>sinon.restore());


    it('testa se traz todos os times com sucesso', async () => {
    const httpResponse = await chai
    .request(app)
    .get('/teams')
    
    expect(httpResponse.status).to.be.equal(200);
    expect(httpResponse.body).to.be.deep.equal(teamsMock);
    });
  })

  describe('Teste GET /teams/:id', () =>{
    beforeEach(sinon.restore);
      
    it('Testa falha ao trazer o time com id não existente', async () => {
  
        const httpResponse = await chai
        .request(app)
        .get('/teams/44')
         
        expect(httpResponse.status).to.be.equal(404);
        expect(httpResponse.body).to.be.deep.equal({ message: 'Team not found.' });
    });

    it('Testa se traz corretamente o time com Id 1', async () => {
        sinon.stub(Team, 'findOne').resolves(teamIdMock as Team);

        const httpResponse = await chai
        .request(app)
        .get('/teams/1')
      
        expect(httpResponse.status).to.be.equal(200);
        expect(httpResponse.body).to.be.deep.equal(teamIdMock);
    });
    
  })
});
