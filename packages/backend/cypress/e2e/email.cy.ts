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

    it('Simulate Email send for password recovery on the Visitor website', () => {
      cy.request({
          method: 'POST',
          url: 'http://localhost:8081/api/sendEmail/userVisitor/sendPasswordRecovery',
          body: {
              username: 'GuardosHelp',
              email: 'guardos-help@outlook.com',
          }
      })
      .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.message).to.eq('Email sent successfully');
      });
  });

  it('Simulate Email send for password recovery on the Resto website', () => {
    cy.request({
        method: 'POST',
        url: 'http://localhost:8081/api/sendEmail/userResto/sendPasswordRecovery',
        body: {
            username: 'GuardosHelp',
            email: 'guardos-help@outlook.com'
        }
    })
    .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('Email sent successfully');
    });
  });

});
