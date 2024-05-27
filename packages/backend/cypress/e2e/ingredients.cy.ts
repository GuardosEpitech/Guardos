describe('Ingredient routes', () => {
  const baseURL = 'http://localhost:8081/api/ingredients';

  it('Test valid ingredient', () => {
    cy.request({
      method: 'POST',
      url: baseURL,
      body: {
        name: 'wheat',
        restoName: 'burgerme',
        allergens: [''],
      },
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        const expectedPattern = /Ingredient wheat saved\s+with id \d+/;
        expect(response.body).to.match(expectedPattern);
      });
  });

  it('Test without name', () => {
    cy.request({
      method: 'POST',
      url: baseURL,
      failOnStatusCode: false,
      body: {
        name: '',
        restoName: 'burgerme',
        allergens: [''],
      },
    })
      .then((response) => {
        expect(response.status).to.eq(400);
      });
  });

  it('Test without restaurant', () => {
    cy.request({
      method: 'POST',
      url: baseURL,
      failOnStatusCode: false,
      body: {
        name: 'wheat',
        restoName: '',
        allergens: [''],
      },
    })
      .then((response) => {
        expect(response.status).to.eq(200);

        const expectedMessage =
            'Coudnt find restaurant named but added ingredient ' +
            'to ingredients database';
        expect(response.body.replace(/\s+/g, ' ')).to.eq(expectedMessage);
      });
  });
});
