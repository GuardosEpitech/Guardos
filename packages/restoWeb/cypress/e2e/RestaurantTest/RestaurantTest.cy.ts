const login = (email:string) => {
  cy.session(email, () => {
      cy.viewport(1710, 948);
      cy.visit('http://localhost:8080/login');
      cy.wait(100);
      cy.get('#\\:r0\\:').type(email);
      cy.wait(100);
      cy.get('#\\:r1\\:').type('TestTest1');
      cy.get('.MuiButtonBase-root').click();
      cy.wait(3000);
  })
}

describe('Restaurants', () => {
  it('Action Option', () => {
    login("test@web.de");
    cy.viewport(1710, 948);
    cy.visit('http://localhost:8080/');
    cy.wait(5000);
    cy.get('.UGCrwwXoPFebDChwiMyQ .MuiPaper-root:first-child #long-button').click();
    cy.get('#basic-menu .MuiPaper-root > .MuiList-root').eq(0).find('[tabindex="0"] > .MuiListItemText-root > .MuiTypography-root').contains('Menu');
    cy.get('#basic-menu .MuiPaper-root > .MuiList-root').eq(0).find(':nth-child(2) > .MuiListItemText-root > .MuiTypography-root').contains('Edit');
    cy.get('#basic-menu .MuiPaper-root > .MuiList-root').eq(0).find(':nth-child(3) > .MuiListItemText-root > .MuiTypography-root').contains('Delete');
  });

  it('Add Restaurant', () => {
    login("test@web.de");
    cy.viewport(1710, 948);
    cy.visit('http://localhost:8080/addResto');
    cy.wait(5000);
    cy.get('.MuiGrid-grid-sm-5 > .MuiFormControl-root > .MuiInputBase-root > #component-outlined').type("Test Restaurant Cypress");
    cy.get('.MuiGrid-grid-sm-3 > .MuiFormControl-root > .MuiInputBase-root > #component-outlined').type("0123445656");
    cy.get('.MuiGrid-grid-xs-3 > .MuiFormControl-root > .MuiInputBase-root > #component-outlined').type("Test Street");
    cy.get('.MuiGrid-grid-xs-1 > .MuiFormControl-root > .MuiInputBase-root > #component-outlined').type("3");
    cy.get(':nth-child(5) > .MuiFormControl-root > .MuiInputBase-root > #component-outlined').type("124355");
    cy.get(':nth-child(6) > .MuiFormControl-root > .MuiInputBase-root > #component-outlined').type("Berlin");
    cy.get(':nth-child(7) > .MuiFormControl-root > .MuiInputBase-root > #component-outlined').type("Germany");
    cy.get(':nth-child(8) > .MuiFormControl-fullWidth > .MuiFormControl-root > .MuiInputBase-root').type("Test Street");
    cy.get('.MuiButton-contained').click();

    cy.get(':last-child > .MuiGrid-container > .MuiGrid-grid-xs-9 > :nth-child(1) > .V8KuF3Zx8hQ9ajX51jw8').contains('Test Restaurant Cypress');
  });

  it('Edit Restaurant', () => {
    login("test@web.de");
    cy.viewport(1710, 948);
    cy.visit('http://localhost:8080');
    cy.wait(5000);
    cy.get(':last-child > .MuiGrid-container > .MuiGrid-grid-xs-9 > :nth-child(1) > .tu9axTq6sjrtLsaZHGQQ > #long-button').click();
    cy.get('#basic-menu .MuiPaper-root > .MuiList-root').eq(0).find(':nth-child(2) > .MuiListItemText-root > .MuiTypography-root').click();
    cy.get('.MuiGrid-grid-sm-5 > .MuiFormControl-root > .MuiInputBase-root > #component-outlined').clear().type("Test Restaurant Cypress Edit");
    cy.get('.MuiButton-contained').click();

    cy.get(':last-child > .MuiGrid-container > .MuiGrid-grid-xs-9 > :nth-child(1) > .V8KuF3Zx8hQ9ajX51jw8').contains('Test Restaurant Cypress Edit');
  }); 

  it('Delete Restaurant', () => {
    login("test@web.de");
    cy.viewport(1710, 948);
    cy.visit('http://localhost:8080');
    cy.wait(5000);
    cy.get(':last-child > .MuiGrid-container > .MuiGrid-grid-xs-9 > :nth-child(1) > .tu9axTq6sjrtLsaZHGQQ > #long-button').click();
    cy.get('#basic-menu .MuiPaper-root > .MuiList-root').eq(0).find(':nth-child(3) > .MuiListItemText-root > .MuiTypography-root').click();
    cy.get('.sc-aXZVg > :nth-child(2) > :nth-child(1)').click();
    cy.get(':last-child > .MuiGrid-container > .MuiGrid-grid-xs-9 > :nth-child(1) > .V8KuF3Zx8hQ9ajX51jw8').should('not.include.text', 'Test Restaurant Cypress Edit');
  }); 
});