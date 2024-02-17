describe('BE delete Users Test:', () => {
  const uID = 99; // save after creating user

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
