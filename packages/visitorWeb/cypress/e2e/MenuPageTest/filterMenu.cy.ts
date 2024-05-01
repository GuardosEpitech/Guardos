describe('Menu Filter', () => {
  it('Check hidden dishes exist in menu', () => {
    // login
    cy.viewport(1710, 948);
    cy.visit('http://localhost:8082/login');
    cy.get('#\\:r0\\:').type('gylian');
    cy.wait(100);
    cy.get('#\\:r1\\:').type('gylianN1');
    cy.get('#root > div > div > div.cCywpriAWfC5rZb8oRYj > div.mC99tckBB8KTxG2vYurJ > div > div > div > form > button').click();
    cy.wait(10000);

    // Choose restaurant and navigate to its menu
    cy.visit('http://localhost:8082');
    cy.get('div.MuiPaper-root:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > button:nth-child(2)').click();

    cy.wait(3000)

    // Check there is hidden dishes
    cy.get('div:nth-child(1) > .wChWcgDugM9d6_p0SVvB .VGtm9cF8_4FgJg4iUQoF').click();
  });
});
