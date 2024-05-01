describe('Cookie routes', () => {
    const userTokenResto = 'U2FsdGVkX1%2FtHlY8YsQTg9NA38yYZs3%2FDqGAENu5Ink%3D';
    const userTokenVisitor = 'U2FsdGVkX18kcMiD7v%2B2DrAk9Zy6OKjsu9CTl2rYMM8LXtpPcb%2BPM9vI5Z0jUZHa';
    const baseURLresto = 'http://localhost:8081/api/profile/resto/';
    const baseURLvisitor = 'http://localhost:8081/api/profile/';

    it('should set cookie preferences of a resto user', () => {
        cy.request({
            method: 'POST',
            url: baseURLresto + `setCookiePref?key=${userTokenResto}`,
            body: {
                functional: true,
                statistical: true,
                marketing: true
            }
        }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.deep.equal("OK");
      });
    });

    it('should get cookie preferences of a resto user', () => {
        cy.request({
            method: 'GET',
            url: baseURLresto + `getCookiePref?key=${userTokenResto}`,
            
        }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.deep.equal({
            isSet: true,
            functional: true,
            statistical: true,
            marketing: true
        });
      });
    });

    it('should set cookie preferences of a visitor user', () => {
        cy.request({
            method: 'POST',
            url: baseURLvisitor + `setCookiePref?key=${userTokenVisitor}`,
            body: {
                functional: true,
                statistical: true,
                marketing: true
            }
        }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.deep.equal("OK");
      });
    });

    it('should get cookie preferences of a visitor user', () => {
        cy.request({
            method: 'GET',
            url: baseURLvisitor + `getCookiePref?key=${userTokenVisitor}`,
            
        }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.deep.equal({
            isSet: true,
            functional: true,
            statistical: true,
            marketing: true
        });
      });
    });
});