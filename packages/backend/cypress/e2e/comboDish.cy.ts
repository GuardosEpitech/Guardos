describe('BE Resto Test combo dish', () => {
    it('should add a combo to a dish', () => {
        // Update the userToken value to match the format from the front end
        const requestBody = {
            restoName: "Ramon‘s Diner",
            dish: {
                name: 'Ramen',
                uid: 4
            },
            combo: [1]
        };

        // Make the request and assert the response
        cy.request({
            method: 'POST',
            url:   'http://localhost:8081/api/dishes/addCombo?key=U2FsdGVkX18Itu7yuvWaLN3wgLfyty5rsTawjFt6%2BfI%3D',
            body: requestBody,
            headers: {
              'Content-Type': 'application/json'
            },
          }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.be.an('Object');
                expect(response.body.name).to.eq('Ramen');
            });
    });

    it('should remove a combo to a dish', () => {
        // Update the userToken value to match the format from the front end
        const requestBody = {
            restoName: "Ramon‘s Diner",
            dish: {
                name: 'Ramen',
                uid: 4
            }
        };

        // Make the request and assert the response
        cy.request({
            method: 'POST',
            url:   'http://localhost:8081/api/dishes/removeCombo?key=U2FsdGVkX18Itu7yuvWaLN3wgLfyty5rsTawjFt6%2BfI%3D',
            body: requestBody,
            headers: {
              'Content-Type': 'application/json'
            },
          }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.be.an('Object');
                expect(response.body.name).to.eq('Ramen');
            });
    });
});
