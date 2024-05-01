describe('Cookie Test', function() {
    it('Tests the buttons for cookie statement', function() {
        cy.viewport(1710, 948)
        cy.visit('http://localhost:8082/');  
        cy.get('.tRA38Vvcwu2ZOyD5jugW > .sPb5SyAgsyDt1tfLfeTB:nth-child(2) > .MuiSwitch-root > .MuiButtonBase-root > .PrivateSwitchBase-input').click();
        cy.get('.tRA38Vvcwu2ZOyD5jugW > .sPb5SyAgsyDt1tfLfeTB:nth-child(3) > .MuiSwitch-root > .MuiButtonBase-root > .PrivateSwitchBase-input').click();
        cy.get('.tRA38Vvcwu2ZOyD5jugW > .sPb5SyAgsyDt1tfLfeTB:nth-child(4) > .MuiSwitch-root > .MuiButtonBase-root > .PrivateSwitchBase-input').click();
        cy.get('div > .TybwmdsVxIYAWWKc6T7g > .Ydu95vqcb6txrflFtnnG > .E5z1fwHzkymuOUjpCorR > .y1AvRdhrcpT9mGu6qMzO').click();
        cy.visit('http://localhost:8082/cookiestatement');
        cy.wait(5000);
        cy.get('.mwYsaLQACsw5RApc_svT > .ABr1Y6rEXctoRbxsLvov:nth-child(1) > .MuiSwitch-root > .MuiButtonBase-root > .PrivateSwitchBase-input').click();
        cy.get('.mwYsaLQACsw5RApc_svT > .ABr1Y6rEXctoRbxsLvov:nth-child(2) > .MuiSwitch-root > .MuiButtonBase-root > .PrivateSwitchBase-input').click();
        cy.get('.mwYsaLQACsw5RApc_svT > .ABr1Y6rEXctoRbxsLvov:nth-child(3) > .MuiSwitch-root > .MuiButtonBase-root > .PrivateSwitchBase-input').click();
    });   
});
   