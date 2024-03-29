describe('Delete Account Test', () => {
  it('should delete the user account', () => {
    // Visit the My Account page
    cy.visit('http://localhost:8082/my-account');

    // Click on the "Delete Account" button
    cy.get('.b3PcCr0BwQwv3F0E3DMj').click();

    // Click on the "DELETE" button and wait for navigation
    cy.get('.MuiButtonBase-root:nth-child(2)').click();
    cy.wait(2000);

    // Validate if the user has been logged out or redirected
    cy.get('.BeRjX90Zejj_RRtK0TjB > a').should('exist');

  });
});
