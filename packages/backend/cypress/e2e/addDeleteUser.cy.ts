describe('BE delete Users Test:', () => {
  const testUser = 'newTestUser';
  const testUserPassword = 'SomePassw0rd';
  const testUserEmail = 'newTest@User.com';
  let userToken = '';
  let userRestoToken = '';

  // ------------------------ ADD USER ------------------------

  it('register user with existing username', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/register/',
      body: {
        username: 'gylian',
        email: 'unimportant',
        password: 'unimportant'
      },
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body).to.deep.equal([false, true]);
      });
  });

  it('register user with existing email', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/register/',
      body: {
        username: 'unimportant',
        email: 'gylian@web.de',
        password: 'unimportant'
      },
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body).to.deep.equal([true, false]);
      });
  });

  it('register user successfully', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/register/',
      body: {
        username: testUser,
        email: testUserEmail,
        password: testUserPassword
      },
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body).to.deep.equal([false, false]);
        userToken = response.body;
      });
  });

  it('register resto user with existing username', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/register/restoWeb',
      body: {
        username: 'gylian',
        email: 'unimportant',
        password: 'unimportant'
      },
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body).to.deep.equal([false, true]);
      });
  });

  it('register resto user with existing email', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/register/restoWeb',
      body: {
        username: 'unimportant',
        email: 'gylian@web.de',
        password: 'unimportant'
      },
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body).to.deep.equal([true, false]);
      });
  });

  it('register resto user successfully', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/register/restoWeb',
      body: {
        username: testUser,
        email: testUserEmail,
        password: testUserPassword
      },
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
        expect(response.body).to.deep.equal([false, false]);
        userRestoToken = response.body;
      });
  });

  // ------------------------ DELETE USER ------------------------

  it('delete user with unvalid uID', () => {
    cy.request({
      failOnStatusCode: false,
      method: 'DELETE',
      url: 'http://localhost:8081/api/delete/',
      params: {
        key: 'invalid',
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
      params: {
        key: 'invalid',
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
      params: {
        key: userToken,
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
      params: {
        key: userRestoToken,
      },
    })
      .then((response) => {
        expect(response.status).to.eq(200);
      });
  });

});
