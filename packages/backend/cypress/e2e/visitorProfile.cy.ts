describe('Profile Routes', () => {
  const testUser = 'gylian';
  const testUserPassword = 'gylianN1';
  const testUserEmail = 'gylian@web.de';

  let userToken = '';
  const tempPassword = 'newPassw0rd';
  const newFilter = {
    filterName: 'Test filter',
    range: 20,
    rating: [2, 5],
    name: 'Mc',
    location: 'Berlin',
    categories: ['burger', 'dessert'],
    allergenList: ['milk', 'peanuts'],
  };

  it('helper: get user token', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/login/',
      body: {
        username: testUser,
        password: testUserPassword,
      },
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('string');
        userToken = encodeURI(response.body);
      });
  });

  it('should get profile details', () => {
    cy.request({
      method: 'GET',
      url: `http://localhost:8081/api/profile?key=${userToken}`,
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('username');
      expect(response.body).to.have.property('email');
    });
  });

  it('should update profile details', () => {
    cy.request({
      method: 'PUT',
      url: `http://localhost:8081/api/profile?key=${userToken}`,
      body: {
        username: testUser,
        email: testUserEmail,
        city: 'Berlin',
        allergens: ['gluten', 'peanut'],
        preferredLanguage: 'de',
      },
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('string');
      userToken = encodeURI(response.body);
    });
  });

  it('should get saved filters', () => {
    cy.request({
      method: 'GET',
      url: `http://localhost:8081/api/profile/filter?key=${userToken}`,
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
    });
  });

  it('should add saved filter', () => {
    cy.request({
      method: 'POST',
      url: `http://localhost:8081/api/profile/filter?key=${userToken}`,
      body: newFilter,
    }).then((response) => {
      // Assertions for a successful response
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.greaterThan(0);

      const lastObject = response.body[response.body.length - 1];
      expect(lastObject.filterName).to.equal(newFilter.filterName);
      expect(lastObject.range).to.equal(newFilter.range);
      expect(lastObject.location).to.equal(newFilter.location);
      expect(lastObject.rating).to.deep.equal(newFilter.rating);
      expect(lastObject.categories).to.deep.equal(newFilter.categories);
      expect(lastObject.allergenList).to.deep.equal(newFilter.allergenList);
    });
  });

  it('should get saved filter by ID', () => {
    const filterName = newFilter.filterName;

    cy.request({
      method: 'GET',
      url: `http://localhost:8081/api/profile/filter/id?key=${userToken}`,
      body: {filterName: filterName},
    }).then((response) => {
      // Assertions for a successful response
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('Object');
      expect(response.body).to.deep.equal(newFilter);
    });
  });

  it('should edit saved filter', () => {
    const filterName = newFilter.filterName;
    const updateFields = {
      filterName: filterName,
      range: 30,
      rating: [4, 5],
      name: 'McD',
      location: 'Munich',
      categories: ['pizza', 'dessert'],
      allergenList: ['gluten', 'peanuts'],
    };

    cy.request({
      method: 'PUT',
      url: `http://localhost:8081/api/profile/filter?key=${userToken}`,
      body: updateFields,
    }).then((response) => {
      // Assertions for a successful response
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
      const actualDataWithoutId = response.body.map(({ _id, ...rest }) => rest);
      expect(actualDataWithoutId).to.deep.contain(updateFields);
      newFilter.filterName = filterName;
    });
  });

  it('should delete saved filter', () => {
    const filterNameToDelete = newFilter.filterName;

    cy.request({
      method: 'DELETE',
      url: `http://localhost:8081/api/profile/filter?key=${userToken}`,
      body: { filterName: filterNameToDelete },
    }).then((response) => {
      // Assertions for a successful response
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
    });
  });

  it('should add profile picture', () => {
    const pictureIdToAdd = 1;

    cy.request({
      method: 'POST',
      url: `http://localhost:8081/api/profile/image?key=${userToken}`,
      body: { pictureId: pictureIdToAdd },
    }).then((response) => {
      // Assertions for a successful response
      expect(response.status).to.equal(200);
      expect(response.body).to.equal(true);
    });
  });

  it('should edit profile picture', () => {
    const newPictureId = 2;

    cy.request({
      method: 'PUT',
      url: `http://localhost:8081/api/profile/image?key=${userToken}`,
      body: { pictureId: newPictureId },
    }).then((response) => {
      // Assertions for a successful response
      expect(response.status).to.equal(200);
      expect(response.body).to.equal(true);
    });
  });

  it('should delete profile picture', () => {
    cy.request({
      method: 'DELETE',
      url: `http://localhost:8081/api/profile/image?key=${userToken}`,
    }).then((response) => {
      // Assertions for a successful response
      expect(response.status).to.equal(200);
      expect(response.body).to.equal(true);
    });
  });

  it('should update password',  () => {

    cy.request({
      method: 'PUT',
      url: `http://localhost:8081/api/profile/password?key=${userToken}`,
      body: {
        oldPassword: testUserPassword,
        newPassword: tempPassword
      },
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('string');
      userToken = encodeURI(response.body);
    });
  });

  it('should change password back',  () => {
    cy.request({
      method: 'PUT',
      url: `http://localhost:8081/api/profile/password?key=${userToken}`,
      body: {
        oldPassword: tempPassword,
        newPassword: testUserPassword
      },
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('string');
    });
  });
});
