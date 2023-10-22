describe('DishesPageTest check dish card', () => {
    it('passes', () => {
        cy.visit('http://localhost:8080/dishes');
        cy.wait(15000);
        cy.contains("Ben & Jerry's Chocolate Fudge Brownie");
    });
});

describe('DishesPageTest add dish card', () => {
    it('passes', () => {
        cy.visit('http://localhost:8080/dishes');
        cy.wait(5000);
        cy.get('.MuiButton-contained').click();
        cy.wait(1000);
        cy.get('.MuiGrid-grid-sm-5 > .MuiFormControl-root > .MuiFormControl-root >' + 
        '.MuiInputBase-root > #component-outlined').type('TestDish123');
        cy.get('.MuiGrid-grid-sm-3 > .MuiFormControl-root > .MuiFormControl-root >' + 
        '.MuiInputBase-root > #outlined-end-adornment').type('6.66');
        cy.get('.MuiGrid-grid-sm-8').eq(0).find('.MuiFormControl-root > .MuiFormControl-root >' + 
        '.MuiInputBase-root > #outlined-multiline-flexible').type('cypress test description');
        cy.get('.MuiGrid-grid-sm-8').eq(1).find('.MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root > #tags-outlined')
        .type('{downarrow}{enter}');
        cy.get('.MuiGrid-grid-sm-8').eq(2).find('.MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root > #tags-outlined')
        .type('{downarrow}{enter}');
        cy.get('.MuiGrid-grid-sm-8').eq(3).find('.MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root > #tags-outlined')
        .type('{downarrow}{enter}');
        cy.get('.MuiGrid-grid-sm-8:last').should('exist')
        .find('.MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root > #tags-outlined')
        .wait(5000).type('{downarrow}').type('{enter}');
        cy.wait(1000);
        cy.get('.MuiButton-contained').click();
        cy.wait(15000);
        cy.contains('TestDish123');
    });
});

describe('DishesPageTest edit dish card', () => {
    it('passes', () => {
        cy.visit('http://localhost:8080/dishes');
        cy.wait(5000);
        cy.contains('TestDish123');
        cy.get('.MuiPaper-root').eq(2).find('.YgFNULgWXmZsCGJKZc5g > .MuiGrid-root > .MuiGrid-root > .ZA6LF0zDIfuiCFc0tcNj > div > #long-button').click();
        cy.contains('Edit').click();
        cy.wait(5000);
        cy.get('.MuiGrid-grid-sm-8').eq(0).find('.MuiFormControl-root > .MuiFormControl-root >' + 
        '.MuiInputBase-root > #outlined-multiline-flexible').type('cypress changed test description');
        cy.get('.MuiButton-contained').click();
        cy.wait(5000);
        cy.contains('cypress changed test description');
    });
});

// delete dish
describe('DishesPageTest delete dish card', () => {
    it('passes', () => {
        cy.visit('http://localhost:8080/dishes');
        cy.wait(5000);
        cy.contains('TestDish123');
        cy.get('.MuiPaper-root').eq(2).find('.YgFNULgWXmZsCGJKZc5g > .MuiGrid-root > .MuiGrid-root > .ZA6LF0zDIfuiCFc0tcNj > div > #long-button').click();
        cy.contains('Delete').click();
        cy.get('.MuiBackdrop-root').click();
        cy.wait(2000);
        cy.get('.MuiPaper-root').eq(2).find('.YgFNULgWXmZsCGJKZc5g > .MuiGrid-root > .MuiGrid-root > .ZA6LF0zDIfuiCFc0tcNj > .sc-aXZVg > div').find('.sc-gEvEer').eq(0).click();
        //cy.contains('Confirm').click();
        cy.wait(10000);
        cy.contains('TestDish123').should('not.exist');
    });
});
