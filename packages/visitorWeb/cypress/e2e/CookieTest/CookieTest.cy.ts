describe('Cookie Test', function() {
    it('Tests the buttons for cookie statement', function() {
        cy.viewport(1710, 948)
        cy.visit('http://localhost:8082/');  
        cy.get('.DRUy7_aUpQqc0JJUgAth > .umVQd8j1fjybEvsKw7LS > .BWjK7ok0zcy0SkolpoFz > .jJVgnk1ZJnMsFocNvw4A:nth-child(2) > .MuiSwitch-root > .MuiButtonBase-root > .PrivateSwitchBase-input').click();
        cy.get('.DRUy7_aUpQqc0JJUgAth > .umVQd8j1fjybEvsKw7LS > .BWjK7ok0zcy0SkolpoFz > .jJVgnk1ZJnMsFocNvw4A:nth-child(3) > .MuiSwitch-root > .MuiButtonBase-root > .PrivateSwitchBase-input').click();
        cy.get('.DRUy7_aUpQqc0JJUgAth > .umVQd8j1fjybEvsKw7LS > .BWjK7ok0zcy0SkolpoFz > .jJVgnk1ZJnMsFocNvw4A:nth-child(4) > .MuiSwitch-root > .MuiButtonBase-root > .PrivateSwitchBase-input').click();
        cy.get('.DRUy7_aUpQqc0JJUgAth > .umVQd8j1fjybEvsKw7LS > .AZOPDytOtJBsl4kzgkej > .MuiButtonBase-root:nth-child(2)').click();
        cy.visit('http://localhost:8082/cookiestatement');
        cy.wait(5000);
        cy.get('.DRUy7_aUpQqc0JJUgAth > .umVQd8j1fjybEvsKw7LS > .BWjK7ok0zcy0SkolpoFz > .jJVgnk1ZJnMsFocNvw4A:nth-child(2) > .MuiSwitch-root > .MuiButtonBase-root > .PrivateSwitchBase-input').click();
        cy.get('.DRUy7_aUpQqc0JJUgAth > .umVQd8j1fjybEvsKw7LS > .BWjK7ok0zcy0SkolpoFz > .jJVgnk1ZJnMsFocNvw4A:nth-child(3) > .MuiSwitch-root > .MuiButtonBase-root > .PrivateSwitchBase-input').click();
        cy.get('.DRUy7_aUpQqc0JJUgAth > .umVQd8j1fjybEvsKw7LS > .BWjK7ok0zcy0SkolpoFz > .jJVgnk1ZJnMsFocNvw4A:nth-child(4) > .MuiSwitch-root > .MuiButtonBase-root > .PrivateSwitchBase-input').click();
        cy.get('.DRUy7_aUpQqc0JJUgAth > .umVQd8j1fjybEvsKw7LS > .AZOPDytOtJBsl4kzgkej > .MuiButtonBase-root:nth-child(2)').click();
        cy.get('.ORGYZ1vDxPX4VjibpyGc > .FyO_pJs3zojJMRXUJxub:nth-child(1) > .MuiSwitch-root > .MuiButtonBase-root > .PrivateSwitchBase-input').click();
        cy.get('.ORGYZ1vDxPX4VjibpyGc > .FyO_pJs3zojJMRXUJxub:nth-child(2) > .MuiSwitch-root > .MuiButtonBase-root > .PrivateSwitchBase-input').click();
        cy.get('.ORGYZ1vDxPX4VjibpyGc > .FyO_pJs3zojJMRXUJxub:nth-child(3) > .MuiSwitch-root > .MuiButtonBase-root > .PrivateSwitchBase-input').click();
    });   
});
   