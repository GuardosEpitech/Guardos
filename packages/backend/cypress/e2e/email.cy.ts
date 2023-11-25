describe('BE Email Test', () => {

    it('should send an email', () => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:8081/api/sendEmail',
            body: {
                name: 'Backend test',
                email: 'backend@test.com',
                subject: 'test email',
                message: 'this is just a test email'
            }
        })
        .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.message).to.eq('Email sent successfully');
        });
    });
});
