import {AES} from 'crypto-js';

describe('Dishes API Tests', () => {
  const testUser = 'gylian';
  const testUserPassword = 'gylianN1';
  
  const getUserToken = () => {
    return AES.encrypt(testUser +
      testUserPassword, 'GuardosResto')
      .toString();
  };
  const userToken = getUserToken();

  it('should get all dishes', () => {
    cy.request('http://localhost:8081/api/dishes')
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
  });

  it('should get dishes by restaurant name', () => {
    cy.request('http://localhost:8081/api/dishes/McDonalds')
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
  });

  it('should get dishes by user', () => {
    // Assuming a valid userToken
    const userToken = 'yourValidUserToken';
    cy.request(`http://localhost:8081/api/dishes/user/dish?key=${userToken}`)
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
  });

  it('should create a new dish', () => {
    const restaurantName = 'McDonalds';
    const dishName = 'NewTestDish';

    cy.request({
      method: 'POST',
      url: `http://localhost:8081/api/dishes/${restaurantName}`,
      body: {
        userToken: userToken,
        resto: restaurantName,
        dish: dishName,
      },
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.name).to.eq(dishName);
      });
  });

  it('should update a dish', () => {
    // Assuming a valid restaurant name and dish name
    const restaurantName = 'McDonalds';
    const dishName = 'NewTestDish';

    cy.request({
      method: 'PUT',
      url: `http://localhost:8081/api/dishes/${restaurantName}`,
      body: {
        name: dishName,
        description: 'updated description'
      },
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.name).to.eq(dishName);
        expect(response.body.description).to.eq('updated description');
      });
  });

  it('should delete a dish', () => {
    const restaurantName = 'McDonalds';
    const dishName = 'NewTestDish';

    cy.request({
      method: 'DELETE',
      url: `http://localhost:8081/api/dishes/${restaurantName}`,
      body: {
        name: dishName,
      },
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.name).to.eq(dishName);
      });
  });
});
