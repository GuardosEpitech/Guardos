describe('Ingredient Routes', () => {
  const url = 'http://localhost:8081/api/ingredients';

  it('should handle GET /ingredients', () => {
    cy.request({
      method: 'GET',
      url: url,
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect((response.body)).to.be.an('array');
    });
  });

  it('should handle adding an ingredient', () => {

    cy.request({
      method: 'POST',
      url: url,
      body: {
        name: 'TestIngredient/Product',
        allergens: ['milk', 'peanuts'],
        ingredients: ['nutella']
      },
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.contain('Coudnt find restaurant');
      expect(response.body).to.contain('but added ingredient');
    });
  });

  it('should handle adding an ingredient, also to resto', () => {

    cy.request({
      method: 'POST',
      url: url,
      body: {
        name: 'TestIngredient/Product',
        id: 99,
        allergens: ['milk', 'peanuts'],
        ingredients: ['nutella'],
        restoName: 'McDonalds'
      },
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.contain('saved');
    });
  });

  it('should handle DELETE an ingredient by id', () => {
    cy.request({
      method: 'DELETE',
      url: url,
      body: {
        id: 99,
      },
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.contain('deleted');
    });
  });

  it('should handle DELETE an ingredient by name', () => {
    cy.request({
      method: 'DELETE',
      url: url,
      body: {
        name: 'TestIngredient/Product',
      },
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.contain('deleted');
    });
  });
});
