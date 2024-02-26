describe('User Routes', () => {
  const username = 'gylian';
  const updatedAllergens = ['allergen1', 'allergen2'];

  it('should update allergens', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/user/allergens/update',
      body: {
        username: username,
        allergens: updatedAllergens,
      },
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('updatedAllergens')
        .and.to.deep.equal(updatedAllergens);
    });
  });
});
