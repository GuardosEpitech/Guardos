describe('ContactPageTest send email', () => {
    it('passes', () => {
        cy.visit('http://localhost:8082/contact');
        cy.wait(5000);
        cy.get('.HjzGE5GP1_Bw5txDw1Hk').click();
        cy.get('#name').click();
        cy.get('#name').type('Fe Email Tester');
        cy.get('#email').click();
        cy.get('#email').type('fe-test@tester.com');
        cy.get('#subject').click();
        cy.get('#subject').type('Fe Email test');
        cy.get('#message').click();
        cy.get('#message').type('test message ');
        cy.get('#send').click();
        cy.get('form').submit();
        cy.wait(500);
        cy.contains('Message successfully sent!');
    });
});
