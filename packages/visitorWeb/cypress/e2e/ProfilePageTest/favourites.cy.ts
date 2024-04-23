describe('Show favourite lists in profile', () => {
  it('should switch favourite list tab', () => {
    // Visit the My Account page
    cy.visit('http://localhost:8082/my-account');

    // Should display resto header
    cy.get('.XuDjXPUCj59DEaQDeiLU > h2').should('contain.text', 'Favorite Restaurants');

    // Switch to dishes favourite tab
    cy.get('.none').click();

    // Should display dishes header
    cy.get('.XuDjXPUCj59DEaQDeiLU > h2').should('contain.text', 'Favorite Dishes');
  });
});
