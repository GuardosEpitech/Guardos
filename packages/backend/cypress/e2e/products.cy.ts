describe('BE Product Test', () => {

  // Test for Burger King Products
  it('should return all products stored for Burger King', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:8081/api/products/Burger King'
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect((response.body)).to.be.an('array');
      });
  });

  // Test for McDonalds Products
  it('should return all products stored for McDonalds', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:8081/api/products/McDonalds'
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

  it('should add a Product to Burger King', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/products/Burger King',
      body: {
        name: 'TestProdBE',
        allergens: 'lactose',
        ingredients: 'milk'
      }
    })
    .then((response) => {
      expect(response.status).to.eq(200);
      //expect(response.body.name).to.eq('TestProdBE');
      //expect(response.body.allergens).to.eq('lactose');
      //expect(response.body.ingredients).to.eq('milk');
    });
  });

  it('should delete a Product from Burger King', () => {
    cy.request({
      method: 'DELETE',
      url: 'http://localhost:8081/api/products/TestProdBE'
    })
    .then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});
