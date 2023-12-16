describe('BE Images Test', () => {
  
  let latestImageId;
  let latestImageIdEnd;
  let latestImageIdINT = -1;
  const restaurantTestName = 'McDonaldsTEST';
  const testImage1 = {
    filename: 'CypressAutoTestImage',
    contentType: 'png',
    size: 124,
    base64: 'testimagestring'
  };
  const testImageChanged = {
    filename: 'CypressAutoTestImageChanged',
    contentType: 'png',
    size: 333,
    base64: 'changedTestimagestring'
  };
  const failImageWithoutBase64 = {
    filename: 'CypressAutoTestImage',
    contentType: 'png',
    size: 124
  };
  const failImageWithoutSize = {
    filename: 'CypressAutoTestImage',
    contentType: 'png',
    base64: 'testimagestring'
  };
  const failImageWithoutContentType = {
    filename: 'CypressAutoTestImage',
    size: 124,
    base64: 'testimagestring'
  };
  const failImageWithoutFilename = {
    contentType: 'png',
    size: 124,
    base64: 'testimagestring'
  };

  it('GET the latest image ID to start tests', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:8081/api/images/latestID'
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        latestImageId = response.body; // cast to int
        latestImageIdINT = parseInt(latestImageId) + 1;
      });
  });

  it('Should POST image to restaurant', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/images/',
      body: {
        restaurant: restaurantTestName,
        image: testImage1
      }
    })
      .then((response) => {
        expect(response.status).to.eq(200);
      });
  });

  it('Should PUT image from restaurant', () => {
    cy.request({
      method: 'PUT',
      url: 'http://localhost:8081/api/images/',
      body: {
        imageId: latestImageIdINT,
        image: testImageChanged,
      }
    })
      .then((response) => {
        expect(response.status).to.eq(200);
      });
  });

  it('Should DELETE image from restaurant', () => {
    cy.request({
      method: 'DELETE',
      url: 'http://localhost:8081/api/images/',
      body: {
        restaurant: restaurantTestName,
        imageId: latestImageIdINT
      }
    })
      .then((response) => {
        expect(response.status).to.eq(200);
      });
  });

  it('Should POST image to dish', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/images/',
      body: {
        restaurant: restaurantTestName,
        dish: 'MCMuffin',
        image: testImage1
      }
    })
      .then((response) => {
        expect(response.status).to.eq(200);
      });
  });

  it('Should DELETE image from dish', () => {
    cy.request({
      method: 'DELETE',
      url: 'http://localhost:8081/api/images/',
      body: {
        restaurant: restaurantTestName,
        dish: 'MCMuffin',
        imageId: latestImageIdINT
      }
    })
      .then((response) => {
        expect(response.status).to.eq(200);
      });
  });

  it('Should POST image to extra', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/images/',
      body: {
        restaurant: restaurantTestName,
        extra: 'cheese',
        image: testImage1
      }
    })
      .then((response) => {
        expect(response.status).to.eq(200);
      });
  });

  it('POST should FAIL because of wrong dish', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/images/',
      failOnStatusCode: false,
      body: {
        restaurant: restaurantTestName,
        dish: 'NOTEXISTING',
        image: testImage1
      }
    })
      .then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to.eq('Post Images failed: Dish does not exist');
      });
  });

  it('POST should FAIL because of wrong restaurant', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/images/',
      failOnStatusCode: false,
      body: {
        restaurant: 'RestaurantnotExistsss',
        image: testImage1
      }
    })
      .then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to
          .eq('Post Images failed: Restaurant does not exist');
      });
  });

  it('POST should FAIL because of wrong extra', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/images/',
      failOnStatusCode: false,
      body: {
        restaurant: restaurantTestName,
        extra: 'abcdef',
        image: testImage1
      }
    })
      .then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to.eq('Post Images failed: Extra does not exist');
      });
  });

  it('POST should FAIl because of missing base64', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/images/',
      failOnStatusCode: false,
      body: {
        restaurant: restaurantTestName,
        extra: 'cheese',
        image: failImageWithoutBase64
      }
    })
      .then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to.eq('Post Images failed: base64 missing');
      });
  });

  it('POST should FAIL because of missing size', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/images/',
      failOnStatusCode: false,
      body: {
        restaurant: restaurantTestName,
        extra: 'cheese',
        image: failImageWithoutSize
      }
    })
      .then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to
          .eq('Post Images failed: size missing or not a number');
      });
  });

  it('POST should FAIL because of size as not number', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/images/',
      failOnStatusCode: false,
      body: {
        restaurant: restaurantTestName,
        extra: 'cheese',
        image: {
          filename: 'CypressAutoTestImage',
          contentType: 'png',
          size: 'zwölf',
          base64: 'testimagestring'
        }
      }
    })
      .then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to
          .eq('Post Images failed: size missing or not a number');
      });
  });

  it('POST should FAIL because of missing content type', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/images/',
      failOnStatusCode: false,
      body: {
        restaurant: restaurantTestName,
        extra: 'cheese',
        image: failImageWithoutContentType
      }
    })
      .then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to.eq('Post Images failed: contentType missing');
      });
  });

  it('POST should FAIL because of missing filename', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/images/',
      failOnStatusCode: false,
      body: {
        restaurant: restaurantTestName,
        extra: 'cheese',
        image: failImageWithoutFilename
      }
    })
      .then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to.eq('Post Images failed: filename missing');
      });
  });

  it('PUT should FAIl because of missing imageId', () => {
    cy.request({
      method: 'PUT',
      url: 'http://localhost:8081/api/images/',
      failOnStatusCode: false,
      body: {
        restaurant: restaurantTestName,
        extra: 'cheese',
        image: failImageWithoutBase64
      }
    })
      .then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to
          .eq('Change Images failed: imageId missing or not a number');
      });
  });

  it('PUT should FAIl because of wrong imageId', () => {
    cy.request({
      method: 'PUT',
      url: 'http://localhost:8081/api/images/',
      failOnStatusCode: false,
      body: {
        restaurant: restaurantTestName,
        imageId: 823589876,
        image: failImageWithoutBase64
      }
    })
      .then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to
          .eq('Change Images failed: Image does not exist');
      });
  });

  it('PUT should FAIL because of missing filename', () => {
    cy.request({
      method: 'PUT',
      url: 'http://localhost:8081/api/images/',
      failOnStatusCode: false,
      body: {
        restaurant: restaurantTestName,
        imageId: latestImageIdINT,
        image: failImageWithoutFilename
      }
    })
      .then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to.eq('Change Images failed: filename missing');
      });
  });

  it('PUT should FAIl because of missing base64', () => {
    cy.request({
      method: 'PUT',
      url: 'http://localhost:8081/api/images/',
      failOnStatusCode: false,
      body: {
        restaurant: restaurantTestName,
        imageId: latestImageIdINT,
        image: failImageWithoutBase64
      }
    })
      .then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to.eq('Change Images failed: base64 missing');
      });
  });

  it('PUT should FAIL because of missing size', () => {
    cy.request({
      method: 'PUT',
      url: 'http://localhost:8081/api/images/',
      failOnStatusCode: false,
      body: {
        restaurant: restaurantTestName,
        imageId: latestImageIdINT,
        image: failImageWithoutSize
      }
    })
      .then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to
          .eq('Change Images failed: size missing or not a number');
      });
  });

  it('PUT should FAIL because of size as not number', () => {
    cy.request({
      method: 'PUT',
      url: 'http://localhost:8081/api/images/',
      failOnStatusCode: false,
      body: {
        restaurant: restaurantTestName,
        imageId: latestImageIdINT,
        image: {
          filename: 'CypressAutoTestImage',
          contentType: 'png',
          size: 'zwölf',
          base64: 'testimagestring'
        }
      }
    })
      .then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to
          .eq('Change Images failed: size missing or not a number');
      });
  });

  it('PUT should FAIL because of missing content type', () => {
    cy.request({
      method: 'PUT',
      url: 'http://localhost:8081/api/images/',
      failOnStatusCode: false,
      body: {
        restaurant: restaurantTestName,
        imageId: latestImageIdINT,
        image: failImageWithoutContentType
      }
    })
      .then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body)
          .to.eq('Change Images failed: contentType missing');
      });
  });

  it('DELETE should FAIl because of missing imageId', () => {
    cy.request({
      method: 'DELETE',
      url: 'http://localhost:8081/api/images/',
      failOnStatusCode: false,
      body: {
        restaurant: restaurantTestName
      }
    })
      .then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to
          .eq('Delete Images failed: imageId missing or not a number');
      });
  });

  it('DELETE should FAIL because of imageId as not number', () => {
    cy.request({
      method: 'PUT',
      url: 'http://localhost:8081/api/images/',
      failOnStatusCode: false,
      body: {
        restaurant: restaurantTestName,
        imageId: 'zwölf'
      }
    })
      .then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to
          .eq('Change Images failed: imageId missing or not a number');
      });
  });

  it('DELETE should FAIL because of wrong restaurant', () => {
    cy.request({
      method: 'DELETE',
      url: 'http://localhost:8081/api/images/',
      failOnStatusCode: false,
      body: {
        restaurant: 'RestaurantnotExistsss',
        imageId: latestImageIdINT
      }
    })
      .then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to
          .eq('Delete Images failed: Restaurant does not exist');
      });
  });

  it('DELETE should FAIl because of wrong imageId', () => {
    cy.request({
      method: 'DELETE',
      url: 'http://localhost:8081/api/images/',
      failOnStatusCode: false,
      body: {
        imageId: 823589876,
        restaurant: restaurantTestName
      }
    })
      .then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to
          .eq('Delete Images failed: Image does not exist');
      });
  });

  it('DELETE should FAIL because of wrong extra', () => {
    cy.request({
      method: 'DELETE',
      url: 'http://localhost:8081/api/images/',
      failOnStatusCode: false,
      body: {
        restaurant: restaurantTestName,
        imageId: latestImageIdINT,
        extra: 'abcdef'
      }
    })
      .then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body)
          .to.eq('Delete Images failed: Extra does not exist');
      });
  });

  it('DELETE should FAIL because of wrong dish', () => {
    cy.request({
      method: 'DELETE',
      url: 'http://localhost:8081/api/images/',
      failOnStatusCode: false,
      body: {
        restaurant: restaurantTestName,
        imageId: latestImageIdINT,
        dish: 'NOTEXISTING'
      }
    })
      .then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body)
          .to.eq('Delete Images failed: Dish does not exist');
      });
  });

  // do this test last because it changes the imageId in prod
  it('Should DELETE image from extra', () => {
    cy.request({
      method: 'DELETE',
      url: 'http://localhost:8081/api/images/',
      body: {
        restaurant: restaurantTestName,
        extra: 'cheese',
        imageId: latestImageIdINT
      }
    })
      .then((response) => {
        expect(response.status).to.eq(200);
      });
  });

  it('GET the latest image ID to end tests', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:8081/api/images/latestID'
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        latestImageIdEnd = response.body; // cast to int
        expect(latestImageIdEnd).to.eq(latestImageId);
      });
  });
  
});
