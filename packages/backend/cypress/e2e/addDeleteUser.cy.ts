import * as process from 'process';
import * as dotenv from 'dotenv';

describe('BE delete Users Test:', () => {
  dotenv.config();
  const uID = 99; // save after creating user

  // ------------------------ ADD USER ------------------------

  it('register user with existing username', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/register/',
      body: {
        username: process.env.testUser,
        email: 'unimportant',
        password: 'unimportant'
      },
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body).to.deep.equal([true, false]);
      });
  });

  it('register user with existing email', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/register/',
      body: {
        username: 'unimportant',
        email: process.env.testUserEmail,
        password: 'unimportant'
      },
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body).to.deep.equal([false, true]);
      });
  });

  it('register user successfully', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/register/',
      body: {
        username: 'BE Test User',
        email: 'testUser@web.de',
        password: 'User123'
      },
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body).to.deep.equal([false, false]);
      });
  });

  it('register resto user with existing username', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/register/restoWeb',
      body: {
        username: process.env.testUser,
        email: 'unimportant',
        password: 'unimportant'
      },
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body).to.deep.equal([true, false]);
      });
  });

  it('register resto user with existing email', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/register/restoWeb',
      body: {
        username: 'unimportant',
        email: process.env.testUserEmail,
        password: 'unimportant'
      },
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body).to.deep.equal([false, true]);
      });
  });

  it('register resto user successfully', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/register/restoWeb',
      body: {
        username: 'BE Test User',
        email: 'testUser@web.de',
        password: 'User123'
      },
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body).to.deep.equal([false, false]);
      });
  });

  // ------------------------ DELETE USER ------------------------

  it('delete user with unvalid uID', () => {
    cy.request({
      failOnStatusCode: false,
      method: 'DELETE',
      url: 'http://localhost:8081/api/delete/',
      body: {
        uID: -99,
      },
    })
      .then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to.eq('Could not find the User to delete');
      });
  });

  it('delete userResto with unvalid uID', () => {
    cy.request({
      failOnStatusCode: false,
      method: 'DELETE',
      url: 'http://localhost:8081/api/delete/resto/',
      body: {
        uID: -99,
      },
    })
      .then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to.eq('Could not find the User to delete');
      });
  });

  it('delete user without body', () => {
    cy.request({
      failOnStatusCode: false,
      method: 'DELETE',
      url: 'http://localhost:8081/api/delete/',
    })
      .then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.eq('Invalid Access');
      });
  });

  it('delete userResto without body', () => {
    cy.request({
      failOnStatusCode: false,
      method: 'DELETE',
      url: 'http://localhost:8081/api/delete/resto/',
    })
      .then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body).to.eq('Invalid Access');
      });
  });

  it('delete user successfully', () => {
    cy.request({
      method: 'DELETE',
      url: 'http://localhost:8081/api/delete/',
      body: {
        uID: uID, // use existing userID
      },
    })
      .then((response) => {
        expect(response.status).to.eq(200);
      });
  });

  it('delete userResto successfully', () => {
    cy.request({
      method: 'DELETE',
      url: 'http://localhost:8081/api/delete/resto/',
      body: {
        uID: uID, // use existing userID
      },
    })
      .then((response) => {
        expect(response.status).to.eq(200);
      });
  });

});
