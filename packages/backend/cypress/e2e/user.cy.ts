describe('User Routes', () => {
  const updatedAllergens = ['allergen1', 'allergen2'];

  it('should update allergens', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/user/allergens/update',
      body: {
        username: 'gylian@web.de', // for some reason it actually requires the email
        allergens: updatedAllergens,
      },
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('updatedAllergens')
        .and.to.deep.equal(updatedAllergens);
    });
  });
});
