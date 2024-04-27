describe('BE Resto Test', () => {
    it('should add a category', () => {
        // Update the userToken value to match the format from the front end
        const requestBody = {
            userToken: 'U2FsdGVkX1+Nslb6A4NHvb/2kGPlIigoEoRLrf42zw0=',
            uid: 40,
            newCategories: [{
                name: 'Main Dish',
                hitRate: 1
            },{
                name: 'add test',
                hitRate: 2
            }]
        };

        // Make the request and assert the response
        cy.request({
            method: 'POST',
            url:   'http://localhost:8081/api/restaurants/updateCategories',
            body: JSON.stringify(requestBody),
            headers: {
              'Content-Type': 'application/json'
            },
            failOnStatusCode: false // Add this line
          }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.be.an('Object');
                expect(response.body.name).to.eq('Wirklich keine AHnung');
                expect(response.body.categories).to.have.length(2);
            });
    });
});
