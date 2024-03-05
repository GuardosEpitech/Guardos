describe('BE Product Test', () => {
  const testUser = 'gylian';
  const testUserPassword = 'gylianN1';

  let userRestoToken = '';

  it('helper: get resto user token', () => {
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
        userRestoToken = encodeURI(response.body);
      });
  });

  // Test for burgerme Products
  it('should return all products stored for burgerme', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:8081/api/products/burgerme'
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect((response.body)).to.be.an('array');
      });
  });

  // Test for The old stone house Restaurant Products
  it('should return all products stored for TheOldStoneHouseRestaurant', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:8081/api/products/The old stone house Restaurant'
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect((response.body)).to.be.an('array');
      });
  });

  it('should return all products stored for gylian user', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:8081/api/products/user/product',
      params: {key: userRestoToken}
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect((response.body)).to.be.an('array');
      });
  });

  it('should add a Product to burgerme', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/products/burgerme',
      body: {
        name: 'TestProdBE',
        allergens: 'lactose',
        ingredients: 'milk'
      }
    })
      .then((response) => {
        expect(response.status).to.eq(200);
      });
  });

  // TODO: this asks for the product name instead of resto name as param (burgerme in url) - what is the expected behaviour right now?
  it('should edit a Product in burgerme', () => {
    cy.request({
      method: 'PUT',
      url: 'http://localhost:8081/api/products/burgerme',
      params: {
        name: 'TestProdBE',
        allergens: 'lactoseEdited',
        ingredients: 'milkEdited'
      }
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.name).to.eq('TestProdBE');
        expect(response.body.allergens).to.eq('lactoseEdited');
        expect(response.body.ingredients).to.eq('milkEdited');
      });
  });

  it('should delete a Product from burgerme', () => {
    cy.request({
      method: 'DELETE',
      url: 'http://localhost:8081/api/products/TestProdBE'
    })
      .then((response) => {
        expect(response.status).to.eq(200);
      });
  });
});
