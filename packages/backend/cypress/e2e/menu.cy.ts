describe('BE get menu by restoID and prevented allergenList', () => {
  // Test for McDonalds Menu, without allergen filter
  it('should return menu sorted by categories, no allergens set', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:8081/api/menu',
      body: {
        restoID: 1,
        allergenList: []
      }
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect((response.body)).to.be.an('array');

        const categories = response.body;
        let doesAnyDishNotFitPreference = false;
        for (let i = 0; i < categories.length; i++) {
          for (let j = 0; j < categories[i].dishes.length; j++) {
            if (!categories[i].dishes[j].fitsPreference) {
              doesAnyDishNotFitPreference = true;
            }
          }
        }
        expect(doesAnyDishNotFitPreference).to.eq(false);
      });
  });

  // Test for McDonalds Menu with allergen filter
  it('should return menu sorted by categories with fitsPreference identicator', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:8081/api/menu',
      body: {
        restoID: 1,
        allergenList: ['milk']
      }
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect((response.body)).to.be.an('array');

        const categories = response.body;
        let doesAnyDishNotFitPreference = false;
        for (let i = 0; i < categories.length; i++) {
          for (let j = 0; j < categories[i].dishes.length; j++) {
            if (!categories[i].dishes[j].fitsPreference) {
              doesAnyDishNotFitPreference = true;
            }
          }
        }
        expect(doesAnyDishNotFitPreference).to.eq(true);
      });
  });

  // Test for McDonalds Menu with allergen filter, case-insensitive
  it('should return menu sorted by categories with fitsPreference identicator, case-insensitive', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:8081/api/menu',
      body: {
        restoID: 1,
        allergenList: ['MiLk']
      }
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect((response.body)).to.be.an('array');

        const categories = response.body;
        let doesAnyDishNotFitPreference = false;
        for (let i = 0; i < categories.length; i++) {
          for (let j = 0; j < categories[i].dishes.length; j++) {
            if (!categories[i].dishes[j].fitsPreference) {
              doesAnyDishNotFitPreference = true;
            }
          }
        }
        expect(doesAnyDishNotFitPreference).to.eq(true);
      });
  });
});
