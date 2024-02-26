export const loginToDelete = (email:string) => {
  cy.session(email, () => {
    cy.viewport(1710, 948);
    cy.visit('http://localhost:8080/login');
    cy.wait(100);
    cy.get('#\\:r0\\:').type(email);
    cy.wait(100);
    cy.get('#\\:r1\\:').type('TestTest1');
    cy.get('.MuiButtonBase-root').click();
    cy.wait(3000);
  });
}


describe('Delete Account Test', () => {
  it('should delete the user account', () => {
    // Visit the My Account page
    cy.visit('http://localhost:8080/account');

    cy.get('.b3PcCr0BwQwv3F0E3DMj').click();

    cy.get('.MuiButtonBase-root:nth-child(2)').click();
    cy.wait(2000);

    cy.get('.X2wsGgbkixL6sNpfFziQ > a').should('exist');

  });
});
