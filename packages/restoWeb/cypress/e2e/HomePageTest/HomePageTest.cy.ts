describe('HomePageTest check resto card menu', () => {
  it('passes', () => {
    cy.visit('http://localhost:8080');
    cy.wait(10000);
    cy.contains('Burger King');
    cy.get(':nth-child(1) > .MuiGrid-container > .MuiGrid-grid-xs-9 > '+
    ':nth-child(1) > .tu9axTq6sjrtLsaZHGQQ > #long-button').click();
    cy.get('.MuiList-root > [tabindex="0"]').click();
    cy.contains('Straße des 17. Juni 100, 10557 Berlin, Germany');
  });
});

describe('HomePageTest check resto card edit', () => {
  it('passes', () => {
    cy.visit('http://localhost:8080');
    cy.wait(10000);
    cy.contains('Burger King');
    cy.get(':nth-child(1) > .MuiGrid-container > .MuiGrid-grid-xs-9 > '+
    ':nth-child(1) > .tu9axTq6sjrtLsaZHGQQ > #long-button').click();
    cy.get('.MuiList-root > :nth-child(2)').click();
    cy.contains('Edit restaurant');
    cy.contains('Burger King');
    cy.get('.MuiButton-contained').click();
    cy.wait(5000);
    cy.url().should('eq', 'http://localhost:8080/');
    cy.contains('This is a success message!');
  });
});

describe('HomePageTest check resto add', () => {
  it('passes', () => {
    cy.visit('http://localhost:8080');
    cy.wait(10000);
    cy.get('.MuiButton-contained').click();
    cy.get('.MuiGrid-grid-sm-5 > .MuiFormControl-root > ' +
      '.MuiInputBase-root > #component-outlined').type('Test128');
    cy.get('.MuiButton-contained').click();
    cy.wait(10000);
    cy.contains('Test128');
  });
});

describe('HomePageTest check resto delete', () => {
  it('passes', () => {
    cy.visit('http://localhost:8080');
    cy.wait(10000);
    cy.contains('Test128');
    cy.get('.MuiPaper-root:last > .MuiGrid-root > .MuiGrid-root > .ZBzxwzmuADcRDx0LwbIp > .tu9axTq6sjrtLsaZHGQQ > #long-button').click();
    cy.get('#basic-menu > .MuiPaper-root > .MuiList-root > .MuiButtonBase-root:last').click();
    cy.get('.MuiBackdrop-root').click();
    cy.contains('Confirm').click();
    cy.contains('Test128').should('not.exist');
  });
});
