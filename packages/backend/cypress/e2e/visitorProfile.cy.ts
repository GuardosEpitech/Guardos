import {AES} from 'crypto-js';
import axios from 'axios';

describe('Profile Routes', () => {
  const testUser = 'gylian';
  const testUserPassword = 'gylianN1';
  const testUserEmail = 'gylian@web.de';

  const getUserToken = () => {
    return AES.encrypt(testUser +
      testUserPassword, 'GuardosResto')
      .toString();
  };

  let userToken = getUserToken();
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
      expect(response.body).to.be.an('Object');

      expect(response.body.username).to.eq(testUser);
      expect(response.body.email).to.eq(testUserEmail,);
      expect(response.body.city).to.eq('Berlin');
      expect(response.body.allergens).to.deep.equal(['gluten', 'peanut']);
      expect(response.body.preferredLanguage).to.eq('de');
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
    }).then(async (response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('string');

      // change pw back if succeeded
      const newToken = response.body;
      const res = await axios({
        method: 'GET',
        url: `http://localhost:8081/api/profile/password?key=${newToken}`,
        params: {
          oldPassword: tempPassword,
          newPassword: testUserPassword
        },
        headers: {
          'content-type': 'application/json',
        },
      });
      userToken = res.data;
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
      expect(response.body).to.contain(newFilter);
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
    const filterName = newFilter.filterName + '1';
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
      expect(response.body).to.be.an('Object');
      expect(response.body).to.deep.equal(updateFields);
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
      expect(response.body).to.be.an('Object');
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
});
