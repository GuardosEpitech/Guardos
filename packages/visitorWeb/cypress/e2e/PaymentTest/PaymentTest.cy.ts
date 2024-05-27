describe('add payment method', function() {
    it('passes', function() {
        cy.viewport(1710, 948);
        cy.visit('http://localhost:8082/login');
        cy.wait(100);
        cy.get('.DRUy7_aUpQqc0JJUgAth > .umVQd8j1fjybEvsKw7LS > .AZOPDytOtJBsl4kzgkej > .MuiButtonBase-root:nth-child(1)').click();
        cy.get('#\\:r0\\:').type('higan1');
        cy.wait(100);
        cy.get('#\\:r1\\:').type('Password1');
        cy.get('.MuiButtonBase-root').click();
        cy.wait(3000);
        cy.visit('http://localhost:8082/payment');
        cy.wait(5000);
        cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .h9M1OnE2sJy7LyKB0UIC > .O2clrE0PvzQaJu1FiVwb > button').click();
        cy.wait(1000);
        cy.url().should('not.eq', 'http://localhost:8082/payment');
              
    });
});
describe('delete payment method', function() {

    it('passes', function() {
        cy.viewport(1710, 948);
        cy.visit('http://localhost:8082/login');
        cy.wait(100);
        cy.get('.DRUy7_aUpQqc0JJUgAth > .umVQd8j1fjybEvsKw7LS > .AZOPDytOtJBsl4kzgkej > .MuiButtonBase-root:nth-child(1)').click();
        cy.get('#\\:r0\\:').type('higan1');
        cy.wait(100);
        cy.get('#\\:r1\\:').type('Password1');
        cy.get('.MuiButtonBase-root').click();
        cy.wait(3000);
        cy.visit('http://localhost:8082/payment');
        cy.get('.WZTdaearlP_yTUm6rMiL > .ny8NJaUaBgSyfjhrHKru:nth-child(1) > .cY7qFBw2qiflpVVIzLkU > div > .MuiSvgIcon-root').click();
        cy.get('.WZTdaearlP_yTUm6rMiL > .ny8NJaUaBgSyfjhrHKru:nth-child(1) > .C0YdoCDQv7CxthbMYOF1 > .uzTovQkXEAfJKWhjv_4r > div > button:nth-child(1)').click();
    });
});
       
   
 
   