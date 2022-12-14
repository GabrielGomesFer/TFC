import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import User from '../database/models/User.Model';

import { Response } from 'superagent';
import { validToken } from './mocks/token';

chai.use(chaiHttp);

const { expect } = chai;

describe('Login', () => {

  let chaiHttpResponse: Response;

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
  });

  afterEach(()=>sinon.restore());

  it('testa falha de login sem o email', async () => {
    const httpResponse = await chai
    .request(app)
    .post('/login')
    .send({ password: 'secret_user' });

    expect(httpResponse.status).to.be.equal(400);
    expect(httpResponse.body).to.be.deep.equal({ message: 'All fields must be filled' });
  });

  it('testa falha de login sem a senha', async () => {
    const httpResponse = await chai
    .request(app)
    .post('/login')
    .send({ email: 'user@user.com' });

    expect(httpResponse.status).to.be.equal(400);
    expect(httpResponse.body).to.be.deep.equal({ message: 'All fields must be filled' });
  });

  it('testa falha de login sem a senha errada', async () => {
    const httpResponse = await chai
    .request(app)
    .post('/login')
    .send({ email: 'user@user.com', password: '123345673' });

    expect(httpResponse.status).to.be.equal(401);
    expect(httpResponse.body).to.be.deep.equal({ message: 'Incorrect email or password' });
  });

  it('testa falha de login sem o email erradp', async () => {
    const httpResponse = await chai
    .request(app)
    .post('/login')
    .send({ email: 'user@superuser.com', password: '123456' });

    expect(httpResponse.status).to.be.equal(401);
    expect(httpResponse.body).to.be.deep.equal({ message: 'Incorrect email or password' });
  });

  it('testa login com sucesso', async () => {
    const httpResponse = await chai
    .request(app)
    .post('/login')
    .send({ email: 'user@user.com', password: 'secret_user' });

    expect(httpResponse.status).to.be.equal(200);
    expect(httpResponse.body).to.have.property('token');
  });


  it('Testa falha ao mandar uma request com token inv??lido', async () => {
    const httpResponse = await chai
    .request(app)
    .get('/login/validate')
    .set('authorization', '');

    expect(httpResponse.status).to.be.equal(401);
    expect(httpResponse.body).to.be.deep.equal({ message: 'unauthorized' });
  });

  it('Testa valida????o com sucesso', async () => {
    
    const httpResponse = await chai
    .request(app)
    .get('/login/validate')
    .set('Authorization', validToken);

    expect(httpResponse.status).to.be.equal(200);
    expect(httpResponse.body).to.be.deep.equal({ message: 'admin' });
  });
});
