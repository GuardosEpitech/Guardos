describe('BE Images Test', () => {

  it('Should upload image to restaurant', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/images/',
      body: {
        restaurant: 'McDonaldsTEST',
        image: {
          filename: 'CypressAutoTestImage',
          contentType: 'png',
          size: 124,
          base64: 'testimagestring'
        }
      }
    })
      .then((response) => {
        expect(response.status).to.eq(200);
      });
  });

  //it('Upload should fail because of wrong restaurant', () => {
  //  cy.request({
  //    method: 'POST',
  //    url: 'http://localhost:8081/api/images/',
  //    body: {
  //      restaurant: 'RestaurantnotExistsss',
  //      image: {
  //        filename: 'CypressAutoTestImage',
  //        contentType: 'png',
  //        size: 124,
  //        base64: 'testimagestring'
  //      }
  //    }
  //  })
  //    .then((response) => {
  //      expect(response.status).to.eq(404);
  //    });
  //});

  it('Should upload image to dish', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/images/',
      body: {
        restaurant: 'McDonaldsTEST',
        dish: 'MCMuffin',
        image: {
          filename: 'CypressAutoTestImage',
          contentType: 'png',
          size: 124,
          base64: 'testimagestring'
        }
      }
    })
      .then((response) => {
        expect(response.status).to.eq(200);
      });
  });

  //it('Upload should fail because of wrong dish', () => {
  //  cy.request({
  //    method: 'POST',
  //    url: 'http://localhost:8081/api/images/',
  //    body: {
  //      restaurant: 'McDonaldsTEST',
  //      dish: 'NOTEXISTING',
  //      image: {
  //        filename: 'CypressAutoTestImage',
  //        contentType: 'png',
  //        size: 124,
  //        base64: 'testimagestring'
  //      }
  //    }
  //  })
  //    .then((response) => {
  //      expect(response.status).to.eq(404);
  //    });
  //});
  
  it('Should upload image to extra', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/api/images/',
      body: {
        restaurant: 'McDonaldsTEST',
        extra: 'cheese',
        image: {
          filename: 'CypressAutoTestImage',
          contentType: 'png',
          size: 124,
          base64: 'testimagestring'
        }
      }
    })
      .then((response) => {
        expect(response.status).to.eq(200);
      });
  });

//  it('Upload should fail because of wrong extra', () => {
//    cy.request({
//      method: 'POST',
//      url: 'http://localhost:8081/api/images/',
//      body: {
//        restaurant: 'McDonaldsTEST',
//        extra: 'abcdef',
//        image: {
//          filename: 'CypressAutoTestImage',
//          contentType: 'png',
//          size: 124,
//          base64: 'testimagestring'
//        }
//      }
//    })
//      .then((response) => {
//        expect(response.status).to.eq(404);
//      });
//  });
  
});
