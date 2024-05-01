describe('Feature Request Form', () => {
    it('successfully submits the form', () => {
      cy.viewport(1710, 948);
      cy.visit('http://localhost:8082/feature-request');
  
      cy.get('input[name="name"]').type('Guardos Team');
      cy.get('input[name="subject"]').type('Cypress Test');
      cy.get('textarea[name="request"]').type('This is a test request');
  
      cy.get('button[type="submit"]').click();
  
      cy.contains('Email sent successfully!').should('be.visible');
    });
  });
  