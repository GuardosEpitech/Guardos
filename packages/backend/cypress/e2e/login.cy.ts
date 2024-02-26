import {AES} from 'crypto-js';

describe('BE login Users Test:', () => {
  const testUser = 'gylian';
  const testUserPassword = 'gylianN1';
  
  const getUserToken = () => {
    return AES.encrypt(testUser +
      testUserPassword, 'Guardos')
      .toString();
  };
  const getUserRestoToken = () => {
    return AES.encrypt(testUser +
      testUserPassword, 'GuardosResto')
      .toString();
  };

  const userToken = getUserToken();
  const userRestoToken = getUserRestoToken();

  it('login user with invalid credentials', () => {
    cy.request({
      failOnStatusCode: false,
      method: 'POST',
      url: 'http://localhost:8081/api/login/',
      body: {
        username: 'Heinz',
        password: 'Dieter',
      },
    })
      .then((response) => {
        expect(response.status).to.eq(403);
        expect(response.body).to.eq('Invalid Access');
      });
  });

  it('login user with valid credentials', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/login/',
      body: {
        username: testUser,
        password: testUserPassword,
      },
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('string');
      });
  });

  it('should fail on checking invalid user token', () => {
    cy.request({
      failOnStatusCode: false,
      method: 'GET',
      url: 'http://localhost:8081/api/login/checkIn',
      params: {
        key: 'invalid token'
      },
    })
      .then((response) => {
        expect(response.status).to.eq(400);
      });
  });

  it('should succeed on checking valid user token', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:8081/api/login/checkIn',
      params: {
        key: userToken
      },
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('uID');
      });
  });


  it('login RESTO user with invalid credentials', () => {
    cy.request({
      failOnStatusCode: false,
      method: 'POST',
      url: 'http://localhost:8081/api/login/restoWeb',
      body: {
        username: 'Heinz',
        password: 'Dieter',
      },
    })
      .then((response) => {
        expect(response.status).to.eq(403);
        expect(response.body).to.eq('Invalid Access');
      });
  });

  it('login resto user with valid credentials', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/login/restoWeb',
      body: {
        username: testUser,
        password: testUserPassword,
      },
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('string');
      });
  });

  it('should fail on checking invalid resto user token', () => {
    cy.request({
      failOnStatusCode: false,
      method: 'GET',
      url: 'http://localhost:8081/api/login/restoWeb/checkIn',
      params: {
        key: 'invalid token'
      },
    })
      .then((response) => {
        expect(response.status).to.eq(400);
      });
  });

  it('should succeed on checking valid resto user token', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:8081/api/login/restoWeb/checkIn',
      params: {
        key: userRestoToken
      },
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('uID');
      });
  });
});
