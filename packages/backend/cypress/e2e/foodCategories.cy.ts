describe('BE Food Categories Test', () => {

  // Test for McDonalds Food
  it('should return the McDonalds restaurant food categories', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:8081/api/foodCategorie',
      body: {
        restaurantId: 1,
      }
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect((response.body)).to.be.an('array');
      });
  });

  // Test for false restaurant
  it('should return an error for not finding the restaurants', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:8081/api/foodCategorie',
      failOnStatusCode: false,
      body: {
        restaurantId: -1,
      }
    })
      .then((response) => {
        expect(response.status).to.eq(400);
      });
  });

  it('should add a Foodcategorie with a restaurant index', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/foodCategorie',
      body: {
        name: 'TestFoodCategorie',
        restaurantId: 1
      }
    })
    .then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it('should add a Foodcategorie with a restaurant index', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/foodCategorie',
      failOnStatusCode: false,
      body: {
        name: 'TestFoodCategorie',
        restaurantId: -1
      }
    })
    .then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  it('should add a Foodcategorie with a restaurant index', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/foodCategorie',
      failOnStatusCode: false,
      body: {
        name: '',
        restaurantId: 1
      }
    })
    .then((response) => {
      expect(response.status).to.eq(400);
    });
  });
});
