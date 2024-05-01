describe('Access to the Rating page', () => {
    it('should access to the rating page and add a rating with a note and a comment and add it to the list', () => {
        cy.visit('http://localhost:8082/');
        cy.get('.MuiButtonBase-root').click();
        cy.get('.css-dqr9h-MuiRating-label:nth-child(5)').click();
        cy.get('#\x3Ar4t\x3A').click();
        cy.get('.css-p7hara:nth-child(2)').click();
        cy.get('.css-p7hara:nth-child(2)').type('Test for Test');
        cy.get('.MuiButton-root').click();
        cy.url().should('contains', 'http://localhost:8082/addreview');
    });
  });
  