describe('Mark dish as favourite', () => {
  it('should mark dish as favourite and keep saved after reload', () => {
    // Visit the home search page
    cy.visit('http://localhost:8082/');

    // click on burgerme element to open menu
    cy.contains('.V8KuF3Zx8hQ9ajX51jw8', 'burgerme')
      .closest('#resto-card')
      .find('div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > button:nth-child(2)')
      .click();

    // cy.contains('.MuiPaper-root:nth-child(6) .MuiButtonBase-root:nth-child(2)', 'Menu').click();

    // Mark dish as favourite dish
    cy.get('.WcS_fz_y4Qm2J61_X2vR > #no-favourite').eq(1).click();

    // Check if the data-testid attribute changes to "FavouriteIcon" - so dish is marked as fav
    cy.get('.WcS_fz_y4Qm2J61_X2vR > #favourite').should('exist');

    // remove as favourite again
    cy.get('.WcS_fz_y4Qm2J61_X2vR > #favourite').eq(1).click();
    cy.get('.WcS_fz_y4Qm2J61_X2vR > #no-favourite').should('exist');
  });
});
