describe('ProductPageTest check products', () => {
    it('passes', () => {
        cy.visit('http://localhost:8080/products');
        cy.wait(5000);
        cy.contains('Test Ingredient');
    });
});

describe('ProductPageTest add new product', () => {
    it('passes', () => {
        cy.visit('http://localhost:8080/products');
        cy.wait(5000);
        cy.get('.MuiButton-contained').click();
        cy.wait(1000);
        cy.get('.MuiGrid-grid-sm-8').eq(0)
        .find('.MuiFormControl-root > .MuiFormControl-root' +
        '> .MuiInputBase-root > #component-outlined').type('CypressTestProduct');
        cy.get('.MuiGrid-grid-sm-8').eq(1)
        .find('.MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root > #tags-outlined')
        .type('{downarrow}{enter}');
        cy.get('.MuiGrid-grid-sm-8').eq(2)
        .find('.MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root > #tags-outlined')
        .wait(7500).type('{downarrow}{enter}');
        cy.wait(1000);
        cy.get('.MuiButton-contained').click();
        cy.contains('This is a success message!');
    });
});

describe('ProductPageTest remove product', () => {
    it('passes', () => {
        cy.visit('http://localhost:8080/products');
        cy.wait(5000);
        cy.contains('CypressTestProduct');
        cy.get('.MuiGrid-root:last > .MuiPaper-root > .FaDRfOJflgeQlItznTpw > .MuiSvgIcon-root').click();
        cy.wait(1000);
        cy.get('.MuiGrid-root:last > .MuiPaper-root > .FaDRfOJflgeQlItznTpw >.sc-aXZVg > div').eq(1).get('.sc-gEvEer').eq(0).click();
        cy.wait(2000);
        cy.contains('CypressTestProduct').should('not.exist');
    });
});
