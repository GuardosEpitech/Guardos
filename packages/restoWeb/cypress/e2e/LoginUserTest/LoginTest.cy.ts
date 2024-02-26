let cookieValue = '';
describe('Login User', () => {
  it('Try to login', () => {
    cy.viewport(1710, 948);
    cy.visit('http://localhost:8080/login');
    cy.wait(100);
    cy.get('#root > div > div > div.cCywpriAWfC5rZb8oRYj > div.mC99tckBB8KTxG2vYurJ > div > div > div > form > div:nth-child(1) > div').type('test@web.de');
    cy.wait(100);
    cy.get('#\\:r1\\:').type('TestTest1');
    cy.get('.MuiButtonBase-root').click();
    cy.wait(3000);

    cy.getCookie('user')
        .should('exist', 'value')
        .then((cookie) => {
          cookieValue = cookie.value;
          cy.log('cookieValue: ' + cookieValue);
        });
  });

  it('passes', () => {
    cy.viewport(1710, 948);
    cy.visit('http://localhost:8080/');
    cy.wait(5000);
    cy.get('#root > div > div > div.cCywpriAWfC5rZb8oRYj > div.scAXbtNkKsDns2FO18ji > span:nth-child(2)').click();
    cy.wait(500);
  });
});

