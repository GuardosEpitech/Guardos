export const login = (email:string) => {
  cy.session(email, () => {
    cy.viewport(1710, 948);
    cy.visit('http://localhost:8080/login');
    cy.wait(100);
    cy.get('#\\:r0\\:').type(email);
    cy.wait(100);
    cy.get('#\\:r1\\:').type('DONOTDELETe1.');
    cy.get('.MuiButtonBase-root').click();
    cy.wait(3000);
  });
}
