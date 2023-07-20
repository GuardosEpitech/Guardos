describe('HomePageTest check resto card menu', () => {
  it('passes', () => {
    cy.visit('http://localhost:8080');
    cy.wait(5000);
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
    cy.wait(5000);
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
    cy.wait(5000);
    cy.get('.MuiButton-contained').click();
    cy.get('.MuiGrid-grid-sm-5 > .MuiFormControl-root > ' +
      '.MuiInputBase-root > #component-outlined').type('Test128');
    cy.get('.MuiButton-contained').click();
    cy.wait(5000);
    cy.contains('Test128');
  });
});

describe('HomePageTest check resto delete', () => {
  it('passes', () => {
    cy.visit('http://localhost:8080');
    cy.wait(5000);
    cy.get(':nth-child(15) > .MuiGrid-container > .MuiGrid-grid-xs-9 >' + 
      ' :nth-child(1) > .tu9axTq6sjrtLsaZHGQQ > #long-button').click();
    cy.get('.MuiList-root > :nth-child(3)').click();
    cy.get('.sc-bgqQcB > :nth-child(2) > :nth-child(1)').click();
    cy.contains('This is a success message!');
  });
});
