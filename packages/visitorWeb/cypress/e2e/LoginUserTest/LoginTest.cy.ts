describe('Login User', () => {
    it('Try to login', () => {
        cy.viewport(1710, 948);
        cy.visit('http://localhost:8082/login');
        cy.get('#\\:r0\\:').type('MarctestZser');
        cy.wait(100);
        cy.get('#\\:r1\\:').type('Marc333.');
        cy.get('#root > div > div > div.cCywpriAWfC5rZb8oRYj > div.mC99tckBB8KTxG2vYurJ > div > div > div > form > button').click();
        cy.wait(3000);
    });
});

describe('Login User', () => {
    it('Try to login', () => {
        cy.viewport(1710, 948);
        cy.visit('http://localhost:8082/dishes');
        cy.wait(3000);
    });
});

           
   