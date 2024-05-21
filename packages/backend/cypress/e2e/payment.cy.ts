
describe('Test Payment link', () => {
  const userTokenV = "U2FsdGVkX1/G7xpqdxMNOlfinqHYpagHYlPj7ji5xigA02NortYTOlH6xVDpDceD";
  const userTokenR = "U2FsdGVkX189SH7kbA9on/0yyYFOefOgpYcvasHQKXE=";
  const baseURL = "http://localhost:8081/api/payments/";
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

  it('should return payment individual setup link', () => {
    cy.request({
      method: 'POST',
      url: baseURL + 'save/create-checkout-session',
      body: {
        domainURL: 'http://localhost:8081',
        customerID: 'cus_Q3JLKz3AV6RgRe',
      },
    })
      .then((response) => {
        expect(response.status).to.eq(200); // does already check the stripe session
      });
  });

  it('should add customer to visitor', () => {
    cy.request({
      method: 'POST',
      url: baseURL + 'addCustomerVisitor',
      body: {
        userToken: userTokenV,
      },
    })
    .then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('string');
    })
  });

  it('should add customer to resto', () => {
    cy.request({
      method: 'POST',
      url: baseURL + 'addCustomerResto',
      body: {
        userToken: userTokenR,
      },
    })
    .then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('string');
    });
  });

  it('should get customerId of visitor', () => {
    cy.request({
      method: 'GET',
      url: baseURL + `getCustomerVisitor?key=${userTokenV}`,
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('string');
    });
  });

  it('should get customerId of resto user', () => {
    cy.request({
      method: 'GET',
      url: baseURL + `getCustomerResto?key=${userTokenR}`,
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('string');
    });
  });

  it('should get payment methods of visitor user', () => {
    cy.request({
      method: 'GET',
      url: baseURL + `showPaymentMethodsVisitor?key=${userTokenV}`,
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
    });
  });

  it('should get payment methods of resto user', () => {
    cy.request({
      method: 'GET',
      url: baseURL + `showPaymentMethodsResto?key=${userTokenR}`,
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
    });
  });
  
});
