describe('add payment method', function() {
    it('passes', function() {
        cy.viewport(1710, 948);
        cy.visit('http://localhost:8082/login');
        cy.wait(100);
        cy.get('#\\:r0\\:').type('higan1');
        cy.wait(100);
        cy.get('#\\:r1\\:').type('Password1');
        cy.get('.MuiButtonBase-root').click();
        cy.wait(3000);
        cy.visit('http://localhost:8082/payment');
        cy.wait(5000);
        cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .h9M1OnE2sJy7LyKB0UIC > .O2clrE0PvzQaJu1FiVwb > button').click();
              
    });
});
describe('delete payment method', function() {

    it('passes', function() {
        cy.viewport(1710, 948);
        cy.visit('http://localhost:8082/login');
        cy.wait(100);
        cy.get('#\\:r0\\:').type('higan1');
        cy.wait(100);
        cy.get('#\\:r1\\:').type('Password1');
        cy.get('.MuiButtonBase-root').click();
        cy.wait(3000);
        cy.visit('http://localhost:8082/payment');
        cy.get('.WZTdaearlP_yTUm6rMiL > .M_HDA_rG5PTFNqvWY5wT:nth-child(1) > .cqV5qvw4eqpyP90Jv1ii > div > .MuiSvgIcon-root').click();
        cy.get('.M_HDA_rG5PTFNqvWY5wT > .FMASqhSItwfzxzFowxDP > .R1GAGLJdrbZcjXRGmAmM > div > button:nth-child(1)').click();
    });
});
       
   
 
   