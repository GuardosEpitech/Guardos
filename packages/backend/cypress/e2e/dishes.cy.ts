describe('Dishes API Tests', () => {
  const testUser = 'gylian';
  const testUserPassword = 'gylianN1';
  let userRestoToken = '';

  it('helper: get resto user token', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/login/restoWeb',
      body: {
        username: testUser,
        password: testUserPassword,
      },
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('string');
        userRestoToken = response.body;
      });
  });

  it('should get all dishes', () => {
    cy.request('http://localhost:8081/api/dishes')
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
  });

  it('should get dishes by restaurant name', () => {
    cy.request('http://localhost:8081/api/dishes/burgerme')
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
  });

  it('should get dishes by user', () => {
    cy.request(encodeURI(`http://localhost:8081/api/dishes/user/dish?key=${userRestoToken}`))
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
  });

  it('should create a new dish', () => {
    const restaurantName = 'burgerme';
    const dishName = 'NewTestDish';

    cy.request({
      method: 'POST',
      url: `http://localhost:8081/api/dishes/${restaurantName}`,
      body: {
        userToken: userRestoToken,
        resto: restaurantName,
        dish: {
          name: dishName,
          price: 10,
        },
        name: dishName,
      },
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.name).to.eq(dishName);
      });
  });

  it('should update a dish', () => {
    // Assuming a valid restaurant name and dish name
    const restaurantName = 'burgerme';
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
    const restaurantName = 'burgerme';
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
        expect(response.body).to.eq(`${dishName} deleted`);
      });
  });
});
