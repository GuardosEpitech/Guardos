describe('Visitor Permissions API Endpoints', () => {
  const userToken = 'U2FsdGVkX1%2BMBYMoRR9X%2BKoM4y76QrJBvqjLQKMvhtk%3D';
  const baseURL = 'http://localhost:8081/api/permissions/visitor';

  it('should add permissions', () => {
    cy.request({
      method: 'POST',
      url: `${baseURL}/addPermissions?key=${userToken}`,
      body: { permissions: ['default', 'premiumUser'] }
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.include('default');
      expect(response.body).to.include('premiumUser');
    });
  });

  it('should not add invalid permissions', () => {
    cy.request({
      method: 'POST',
      url: `${baseURL}/addPermissions?key=${userToken}`,
      body: { permissions: ['invalidPermission', 'anotherInvalidPermission'] },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.equal(400);
      expect(response.body).to.have.property('error');
      expect(response.body.error).to.eq('No valid permissions provided');
    });
  });

  it('should remove permissions', () => {
    cy.request({
      method: 'PUT',
      url: `${baseURL}/removePermissions?key=${userToken}`,
      body: { permissions: ['default'] }
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).not.to.include('default');
    });
  });

  it('should delete all permissions', () => {
    cy.request({
      method: 'DELETE',
      url: `${baseURL}/deleteAllPermissions?key=${userToken}`
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array').that.is.empty;
    });
  });

  it('should get visitor permissions', () => {
    cy.request({
      method: 'GET',
      url: `${baseURL}?key=${userToken}`,
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
    });
  });
});
