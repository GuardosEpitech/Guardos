describe('HomePageTest check resto card menu', () => {
  it('passes', () => {
    cy.visit('http://localhost:8082/');
    cy.wait(5000);
    cy.get('._ZAEIa20GE7pIWflAL8Q > .ZFtyqGWLYoXmwhO3rN1F >.MuiFormControl-root >.MuiInputBase-root > .MuiInputBase-input').click();
    cy.get('._ZAEIa20GE7pIWflAL8Q > .ZFtyqGWLYoXmwhO3rN1F >.MuiFormControl-root >.MuiInputBase-root > .MuiInputBase-input').type('McDonalds');
    cy.get('._ZAEIa20GE7pIWflAL8Q > .ZFtyqGWLYoXmwhO3rN1F > div >.MuiFormControl-root >.MuiInputBase-root > .MuiInputBase-input').click();
    cy.get('._ZAEIa20GE7pIWflAL8Q > .ZFtyqGWLYoXmwhO3rN1F > div >.MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input').type('Munich');
    cy.get('.css-16m7d31-MuiButtonBase-root-MuiButton-root').click();
    cy.wait(1000);
    cy.contains('McDonalds');
    cy.contains('Details').click();
    cy.contains('McDonalds');
    cy.get('.MuiDialog-root >.MuiDialog-container >.MuiPaper-root >.MuiDialogContent-root >.MuiGrid-root >.MuiGrid-root:last >.A7MUek98VtFrzxZWbxNT >.MuiButtonBase-root').click();
    cy.wait(1000);
    cy.contains('Dessert');
  });
});
