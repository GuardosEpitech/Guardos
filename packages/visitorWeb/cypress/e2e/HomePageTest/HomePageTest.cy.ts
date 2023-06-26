describe('HomePageTest check resto card menu', () => {
  it('passes', () => {
    cy.visit('http://localhost:8082/');
    cy.wait(5000);
    cy.get('#\3Ar0\3A').click();
    cy.get('#\3Ar0\3A').type('Burger King');
    cy.get('#\3Ar1\3A').click();
    cy.get('#\3Ar1\3A').type('Berlin');
    cy.contains('Burger King');
    cy.get('.css-16m7d31-MuiButtonBase-root-MuiButton-root').click();
    cy.contains('Dessert');
    cy.visit('http://localhost:8082/');
    cy.wait(5000);
    cy.get('.zfKNfdHc4YwKOorEZYMV > .MuiFormControlLabel-root:nth-child(1) .PrivateSwitchBase-input').click();
    cy.get('.zfKNfdHc4YwKOorEZYMV > .MuiFormControlLabel-root:nth-child(4) .PrivateSwitchBase-input').click();
    cy.get('.zfKNfdHc4YwKOorEZYMV > .MuiFormControlLabel-root:nth-child(5) .PrivateSwitchBase-input').click();
    cy.get('.zfKNfdHc4YwKOorEZYMV > .MuiFormControlLabel-root:nth-child(2) .PrivateSwitchBase-input').click();
    cy.contains('SaleEPepe');
    cy.get('.MuiChip-colorSecondary > .MuiChip-label').click();
    cy.contains('The old stone house Restaurant');
  });
});
