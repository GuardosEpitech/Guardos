describe('Filter API - Filter Criteria Tests', () => {

  // Test for filtering by Name
  it('should successfully filter restaurants by name', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/filter',
      body: {
        name: 'test'
      }
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
  });

  // Test for filtering by Allergen
  it('should successfully filter restaurants by allergen', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/filter',
      body: {
        allergenList: ['peanuts']
      }
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
  });

  // Test for filtering by Location
  it('should successfully filter restaurants by location', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/filter',
      body: {
        location: 'New York'
      }
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
  });

  // Test for filtering by Category
  it('should successfully filter restaurants by category', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/filter',
      body: {
        categories: ['Italian']
      }
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
  });

  // Test for filtering by Rating (Review)
  it('should successfully filter restaurants by rating', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/filter',
      body: {
        rating: 4
      }
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
  });

  it('should successfully filter restaurants by pricing', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/filter',
      body: {
        pricing: 'moderate' // replace with the appropriate pricing filter key and value
      }
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
  });

  describe('Filter API - ALL Filter Criteria Test', () => {
    // Test for filtering by multiple criteria (Name, Allergen, Location, Category, Rating, and Pricing)
    it('should successfully filter restaurants by multiple criteria', () => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:8081/api/filter',
        body: {
          name: 'test',
          allergenList: ['peanuts'],
          location: 'Berlin',
          categories: ['Italian', 'Mexican'],
          rating: 4
        }
      })
        .then((response) => {
          expect(response.status).to.eq(200);
          // Additional assertions depending on the structure of the response
          expect(response.body).to.be.an('array');

        // Optionally, further assertions to check if the response adheres to the filters
        // For example, checking if a particular field in the response matches the filter criteria
        });
    });

  });

});
