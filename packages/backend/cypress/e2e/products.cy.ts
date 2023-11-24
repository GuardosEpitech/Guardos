describe('BE Product Test', () => {

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

  it('should add a Product to McDonalds', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/products/McDonalds',
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

  it('should delete a Product from McDonalds', () => {
    cy.request({
      method: 'DELETE',
      url: 'http://localhost:8081/api/products/TestProdBE'
    })
    .then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});
