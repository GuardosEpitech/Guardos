import {login} from '../../fixtures/login';

describe('DishesPageTest check dish card', () => {
    it('passes', () => {
        login('test@web.de');
        cy.visit('http://localhost:8080/dishes');
        cy.wait(5000);
    });
});

describe('DishesPageTest add dish card', () => {
    it('passes', () => {
        login('test@web.de');
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
        login('test@web.de');
        cy.visit('http://localhost:8080/dishes');
        cy.wait(5000);

        const genericSelector = '#root > div > div > div > div > div > div > div';
        cy.get(genericSelector).contains('TestDish123').scrollIntoView().then($element => {
            cy.wrap($element).parent().find('button#long-button').click({force: true});
            cy.get('#basic-menu').should('be.visible').then(() => {
                cy.get('#basic-menu > div.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation8.MuiPopover-paper.MuiMenu-paper.MuiMenu-paper.css-3dzjca-MuiPaper-root-MuiPopover-paper-MuiMenu-paper > ul > li:nth-child(1)').click();
            });
        });
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
        login('test@web.de');
        cy.visit('http://localhost:8080/dishes');
        cy.wait(5000);

        const genericSelector = '#root > div > div > div > div > div > div > div';
        cy.get(genericSelector).contains('TestDish123').scrollIntoView().then($element => {
            cy.wrap($element).parent().find('button#long-button').click({force: true});
            cy.get('#basic-menu').should('be.visible').then(() => {
                cy.get('#basic-menu > div.MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded.MuiPaper-elevation8.MuiPopover-paper.MuiMenu-paper.MuiMenu-paper.css-3dzjca-MuiPaper-root-MuiPopover-paper-MuiMenu-paper > ul > li:nth-child(2)').click();
                cy.wait(1000);
                cy.get('.MuiGrid-grid-xs-10 > .ZA6LF0zDIfuiCFc0tcNj > .sc-aXZVg > :nth-child(2) > :nth-child(1)').click({force: true});
            });
        });
        cy.wait(5000);
        cy.contains('TestDish123').should('not.exist');
    });
});

