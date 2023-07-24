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
});
