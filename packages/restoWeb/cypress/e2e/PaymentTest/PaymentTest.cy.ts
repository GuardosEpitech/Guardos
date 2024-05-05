describe('add payment method', function() {
    it('passes', function() {
        cy.viewport(1710, 948);
        cy.visit('http://localhost:8080/login');
        cy.wait(100);
        cy.get('#\\:r0\\:').type('CookieTest');
        cy.wait(100);
        cy.get('#\\:r1\\:').type('Password1');
        cy.get('.MuiButtonBase-root').click();
        cy.wait(3000);
        cy.visit('http://localhost:8080/payment');
        cy.wait(5000);
        cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .h9M1OnE2sJy7LyKB0UIC > .O2clrE0PvzQaJu1FiVwb > button').click();
        cy.wait(15000);
        cy.get('.FormFieldGroup-child > .FormFieldInput > .CheckoutInputContainer > .InputContainer > #cardNumber').click();
        cy.get('.FormFieldGroup-child > .FormFieldInput > .CheckoutInputContainer > .InputContainer > #cardNumber').type('4242 4242 4242 4242');
        cy.get('.FormFieldGroup-child > .FormFieldInput > .CheckoutInputContainer > .InputContainer > #cardExpiry').click();
        cy.get('.FormFieldGroup-child > .FormFieldInput > .CheckoutInputContainer > .InputContainer > #cardExpiry').type('04 / 45');
        cy.get('.FormFieldGroup-child > .FormFieldInput > .CheckoutInputContainer > .InputContainer > #cardCvc').click();
        cy.get('.FormFieldGroup-child > .FormFieldInput > .CheckoutInputContainer > .InputContainer > #cardCvc').type('455');
        cy.get('.FormFieldGroup-child > .FormFieldInput > .CheckoutInputContainer > .InputContainer > #billingName').click();
        cy.get('.FormFieldGroup-child > .FormFieldInput > .CheckoutInputContainer > .InputContainer > #billingName').type('CypressTest');
        cy.get('.PaymentForm-confirmPaymentContainer > .ConfirmPayment > .flex-item > .SubmitButton > .SubmitButton-IconContainer').click();
        cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .gQj1v2zFTNP0J4h65MY6 > .d2qLREhhTWmaNk1cebhR > button').click();      
    });
});
describe('delete payment method', function() {

    it('passes', function() {
        cy.viewport(1710, 948);
        cy.visit('http://localhost:8080/login');
        cy.wait(100);
        cy.get('#\\:r0\\:').type('CookieTest');
        cy.wait(100);
        cy.get('#\\:r1\\:').type('Password1');
        cy.get('.MuiButtonBase-root').click();
        cy.wait(3000);
        cy.visit('http://localhost:8080/payment');
        cy.get('.WZTdaearlP_yTUm6rMiL > .M_HDA_rG5PTFNqvWY5wT:nth-child(1) > .cqV5qvw4eqpyP90Jv1ii > div > .MuiSvgIcon-root').click();
        cy.get('.M_HDA_rG5PTFNqvWY5wT > .FMASqhSItwfzxzFowxDP > .R1GAGLJdrbZcjXRGmAmM > div > button:nth-child(1)').click();
    });
});
       
   
 
   