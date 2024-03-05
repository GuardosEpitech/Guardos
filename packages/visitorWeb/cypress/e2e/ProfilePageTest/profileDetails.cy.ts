const pw = 'gylianN1';
const tempPw = 'gylianN10';

const login = (email: string, password: string) => {
  cy.session(email, () => {
    cy.viewport(1710, 948);
    cy.visit('http://localhost:8082/login');
    cy.wait(100);
    cy.get('#\\:r0\\:').type(email);
    cy.wait(100);
    cy.get('#\\:r1\\:').type(password);
    cy.get('.MuiButtonBase-root').click();
    cy.wait(3000);
  })
}

describe('Profile Details Test', () => {
  it('should load the user details', () => {
    login('gylian', pw);
    // Visit the My Account page
    cy.visit('http://localhost:8082/my-account');

    // check email field
    cy.get('div:nth-child(3) > .t32YvAl3h5jpNxRDNa4l')
      .invoke('val')
      .should('eq', 'gylian@web.de');

    // check username field
    cy.get('div:nth-child(4) > .t32YvAl3h5jpNxRDNa4l')
      .invoke('val')
      .should('eq', 'gylian');

    // check city field
    cy.get('div:nth-child(5) > .t32YvAl3h5jpNxRDNa4l')
      .invoke('val')
      .should('eq', 'Berlin');

    // check allergens
    // cy.get('.MuiButtonBase-root:nth-child(2)')
    //   .invoke('text')
    //   .should('eq', 'gluten');
    //
    // // check language
    // cy.get('.MuiButtonBase-root:nth-child(1)')
    //   .invoke('text')
    //   .should('eq', 'Deutsch');

    // Press save button
    cy.get('.YBHP8vI2UcLjmVrRdulb').click();

    cy.get('.xoOnTxoiinz3mAnPeoLA').contains('successfully');
  });

  it('should change password', () => {
    login('gylian', pw);

    cy.visit('http://localhost:8082/my-account');

    // click on Change password button to extend dropdown
    cy.get('.N_XWBgnNrLmlpk0tKX9j').click();

    // click first input filed (old password)
    cy.get('#\\:r3\\:').click();
    // enter old password
    cy.get('#\\:r3\\:').type(pw);
    // enter new password
    cy.get('#\\:r4\\:').type(tempPw);
    // confirm new password
    cy.get('#\\:r5\\:').type(tempPw);

    // click save button
    cy.get('div:nth-child(4) > .YBHP8vI2UcLjmVrRdulb').click();
    // confirmation that action succeeded
    cy.get('.xoOnTxoiinz3mAnPeoLA').contains('successfully');
  })

  it('shoudl change password back', () => {
    login('gylian', tempPw);

    cy.visit('http://localhost:8082/my-account');

    // click on Change password button to extend dropdown
    cy.get('.N_XWBgnNrLmlpk0tKX9j').click();

    // click first input filed (old password)
    cy.get('#\\:r3\\:').click();
    // enter old password
    cy.get('#\\:r3\\:').type(tempPw);
    // enter new password
    cy.get('#\\:r4\\:').type(pw);
    // confirm new password
    cy.get('#\\:r5\\:').type(pw);

    // click save button
    cy.get('div:nth-child(4) > .YBHP8vI2UcLjmVrRdulb').click();
    // confirmation that action succeeded
    cy.get('.xoOnTxoiinz3mAnPeoLA').contains('successfully');
  })
});
