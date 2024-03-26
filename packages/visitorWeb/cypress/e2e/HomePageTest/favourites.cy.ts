describe('Mark resto as favourite', () => {
  it('should mark resto as favourite', () => {
    // Visit the Home search page
    cy.visit('http://localhost:8082/');

    // Mark McDonalds as favourite resto
    cy.contains('.V8KuF3Zx8hQ9ajX51jw8', 'McDonalds')
      .closest('#resto-card')
      .find('div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(8) > #no-favourite')
      .click();

    // Check if the data-testid attribute changes to "FavouriteIcon" - so McDonalds is marked as fav
    cy.contains('.V8KuF3Zx8hQ9ajX51jw8', 'McDonalds')
      .closest('#resto-card')
      .find('div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(8) > #favourite')
      .should('exist');

    // remove as favourite again
    cy.contains('.V8KuF3Zx8hQ9ajX51jw8', 'McDonalds')
      .closest('#resto-card')
      .find('div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(8) > #favourite')
      .click();
    cy.contains('.V8KuF3Zx8hQ9ajX51jw8', 'McDonalds')
      .closest('#resto-card')
      .find('div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(8) > #no-favourite')
      .should('exist');
  });
});
