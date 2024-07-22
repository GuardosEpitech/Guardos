describe('adds and removes discount from dish', () => {
    const dataAdd = {
        "restoID": 52,
        "dish": {
            "name": "Coke",
            "uid": 1,
            "discount": 5,
            "validTill": "2024/10/10"
        }
    };
    const dataRemove = {
        "restoID": 52,
        "dish": {
            "name": "Coke",
            "uid": 1
        }
    };

    it('should add a discount to the dish Coke', () => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:8081/api/dishes/addDiscount',
            body: dataAdd,
            headers: {
                'Content-Type': 'application/json'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('Object');
            expect(response.body.discount).to.eq(5);
        });
    });
    it('should remove discount from the dish Coke', () => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:8081/api/dishes/removeDiscount',
            body: dataRemove,
            headers: {
                'Content-Type': 'application/json'
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('Object');
            expect(response.body.discount).to.eq(-1);
        });
    });
});