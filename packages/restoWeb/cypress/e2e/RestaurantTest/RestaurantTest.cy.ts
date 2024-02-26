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
  it('Check Action Options: Menu, Edit, Delete', () => {
    login("test@web.de");
    cy.viewport(1710, 948);
    cy.visit('http://localhost:8080/');
    cy.wait(5000);
    // Click on Action Icon
    cy.get('.UGCrwwXoPFebDChwiMyQ .MuiPaper-root:first-child #long-button').click();
    // Check for Menu Option
    cy.get('#basic-menu .MuiPaper-root > .MuiList-root').eq(0).find('[tabindex="0"] > .MuiListItemText-root > .MuiTypography-root').contains('Menu');
    // Check for Edit Option
    cy.get('#basic-menu .MuiPaper-root > .MuiList-root').eq(0).find(':nth-child(2) > .MuiListItemText-root > .MuiTypography-root').contains('Edit');
    // Check for Delete Option
    cy.get('#basic-menu .MuiPaper-root > .MuiList-root').eq(0).find(':nth-child(3) > .MuiListItemText-root > .MuiTypography-root').contains('Delete');
  });

  it('Add Restaurant', () => {
    login("test@web.de");
    cy.viewport(1710, 948);
    cy.visit('http://localhost:8080/addResto');
    cy.wait(5000);
    // Type restaurant name
    cy.get('.MuiGrid-grid-sm-5 > .MuiFormControl-root > .MuiInputBase-root > #component-outlined').type("Test Restaurant Cypress");
    // Type phone number
    cy.get('.MuiGrid-grid-sm-3 > .MuiFormControl-root > .MuiInputBase-root > #component-outlined').type("0123445656");
    // Type street name
    cy.get('.MuiGrid-grid-xs-3 > .MuiFormControl-root > .MuiInputBase-root > #component-outlined').type("Test Street");
    // Type street number
    cy.get('.MuiGrid-grid-xs-1 > .MuiFormControl-root > .MuiInputBase-root > #component-outlined').type("3");
    // Type local code
    cy.get(':nth-child(5) > .MuiFormControl-root > .MuiInputBase-root > #component-outlined').type("124355");
    // Type city name
    cy.get(':nth-child(6) > .MuiFormControl-root > .MuiInputBase-root > #component-outlined').type("Berlin");
    // Type country name
    cy.get(':nth-child(7) > .MuiFormControl-root > .MuiInputBase-root > #component-outlined').type("Germany");
    // Type into descriptionbox
    cy.get(':nth-child(8) > .MuiFormControl-fullWidth > .MuiFormControl-root > .MuiInputBase-root').type("Test Street");
    // Click add restaurant button
    cy.get('.MuiButton-contained').click();

    // Check for created restaurant
    cy.get(':last-child > .MuiGrid-container > .MuiGrid-grid-xs-9 > :nth-child(1) > .V8KuF3Zx8hQ9ajX51jw8').contains('Test Restaurant Cypress');
  });

  it('Edit Restaurant', () => {
    login("test@web.de");
    cy.viewport(1710, 948);
    cy.visit('http://localhost:8080');
    cy.wait(5000);
    // click on the last restaurant action button
    cy.get(':last-child > .MuiGrid-container > .MuiGrid-grid-xs-9 > :nth-child(1) > .tu9axTq6sjrtLsaZHGQQ > #long-button').click();
    // click on the edit button
    cy.get('#basic-menu .MuiPaper-root > .MuiList-root').eq(0).find(':nth-child(2) > .MuiListItemText-root > .MuiTypography-root').click();
    // type a new name
    cy.get('.MuiGrid-grid-sm-5 > .MuiFormControl-root > .MuiInputBase-root > #component-outlined').clear().type("Test Restaurant Cypress Edit");
    // click on safe
    cy.get('.MuiButton-contained').click();

    // checking the last restaurant for the change
    cy.get(':last-child > .MuiGrid-container > .MuiGrid-grid-xs-9 > :nth-child(1) > .V8KuF3Zx8hQ9ajX51jw8').contains('Test Restaurant Cypress Edit');
  }); 

  it('Delete Restaurant', () => {
    login("test@web.de");
    cy.viewport(1710, 948);
    cy.visit('http://localhost:8080');
    cy.wait(5000);
    // click on the action button
    cy.get(':last-child > .MuiGrid-container > .MuiGrid-grid-xs-9 > :nth-child(1) > .tu9axTq6sjrtLsaZHGQQ > #long-button').click();
    // click on the delete action
    cy.get('#basic-menu .MuiPaper-root > .MuiList-root').eq(0).find(':nth-child(3) > .MuiListItemText-root > .MuiTypography-root').click();
    // click on agreeing to delete button
    cy.get('.sc-aXZVg > :nth-child(2) > :nth-child(1)').click();
    // check for deleted restaurant
    cy.get(':last-child > .MuiGrid-container > .MuiGrid-grid-xs-9 > :nth-child(1) > .V8KuF3Zx8hQ9ajX51jw8').should('not.include.text', 'Test Restaurant Cypress Edit');
  }); 
});