describe('Favourites routes', () => {
  const userToken = 'U2FsdGVkX1%2BMBYMoRR9X%2BKoM4y76QrJBvqjLQKMvhtk%3D';
  const baseURL = 'http://localhost:8081/api/favourites';

  it('should add a restaurant as favourite', () => {
    cy.request('POST', baseURL + `/resto?key=${userToken}`, {
      restoID: 1
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('restoIDs');
      expect(response.body.restoIDs).to.include(1);
    });
  });

  it('should not add an invalid restaurant as favourite', () => {
    cy.request({
      method: 'POST',
      url: baseURL + `/resto?key=${userToken}`,
      body: {
        restoID: -1
      },
      failOnStatusCode: false // Add this line
    }).then((response) => {
      expect(response.status).to.equal(404);
      expect(response.body).to.eq('Couldn\'t find restaurant with id -1');
    });
  });


  it('should add a dish as favourite', () => {
    cy.request('POST', baseURL + `/dish?key=${userToken}`, {
      restoID: 1,
      dishID: 1
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('dishIDs');
      expect(response.body.dishIDs).to.deep.include({
        restoID: 1,
        dishID: 1
      });
    });
  });

  it('should not add an invalid dish as favourite', () => {
    cy.request({
      method: 'POST',
      url: baseURL + `/dish?key=${userToken}`,
      body: {
        restoID: 1,
        dishID: -1
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.equal(404);
      expect(response.body).to.eq('Couldn\'t find dish with id -1 from resto 1');
    });
  });

  it('should delete a restaurant from favourites', () => {
    cy.request('DELETE', baseURL + `/resto?key=${userToken}`, {
      restoID: 1
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('restoIDs');
      expect(response.body.restoIDs).not.to.include(1);
    });
  });

  it('should delete a dish from favourites', () => {
    cy.request('DELETE', baseURL + `/dish?key=${userToken}`, {
      restoID: 1,
      dishID: 1
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('dishIDs');
      expect(response.body.dishIDs).not.to.deep.include({
        restoID: 1,
        dishID: 1
      });
    });
  });

  it('should get favourite restaurants', () => {
    cy.request('GET', baseURL + `/resto?key=${userToken}`)
      .then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
      });
  });

  it('should get favourite dishes', () => {
    cy.request('GET', baseURL + `/dish?key=${userToken}`)
      .then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
      });
  });
});
