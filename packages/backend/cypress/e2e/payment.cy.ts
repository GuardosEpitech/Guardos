
describe('Test Payment link', () => {

  it('should return error because domain is missing', () => {
    cy.request({
      failOnStatusCode: false,
      method: 'POST',
      url: 'http://localhost:8081/api/payments/create-checkout-session',
    })
      .then((response) => {
        expect(response.status).to.eq(400);
      });
  });

  it('should return payment individual paymentlink', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/payments/create-checkout-session',
      body: {
        domainURL: 'http://localhost:8081',
      },
    })
      .then((response) => {
        expect(response.status).to.eq(200); // does already check the stripe session
      });
  });
  
});
