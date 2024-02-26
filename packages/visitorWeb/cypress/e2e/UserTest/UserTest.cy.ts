describe('Register', () => {
    it('passes', () => {
        cy.viewport(1710, 948);
        cy.visit('http://localhost:8082/');
        cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .jgdtqJiol3q8AD6AO_6l > .BeRjX90Zejj_RRtK0TjB > a').click();
        cy.get('.d5Iqr4Hr_KswpjgdaQ3C > .Ya4lhXp5Fb_4KVGtJDrV > form > .n9NneHtW52Iramqkd4mx:nth-child(5) > .mUi5TtzSixkfc6ylvswE').click();
        cy.get('.u_QCSTHkvFLIVpGoguc0 > form > .MuiFormControl-root').eq(0).find('.MuiInputBase-root > .MuiInputBase-input').click();
        cy.get('.u_QCSTHkvFLIVpGoguc0 > form > .MuiFormControl-root').eq(0).find('.MuiInputBase-root > .MuiInputBase-input').type('CypressTest1');
        cy.get('.u_QCSTHkvFLIVpGoguc0 > form > .MuiFormControl-root').eq(1).find('.MuiInputBase-root > .MuiInputBase-input').click();
        cy.get('.u_QCSTHkvFLIVpGoguc0 > form > .MuiFormControl-root').eq(1).find('.MuiInputBase-root > .MuiInputBase-input').type('cypress1@email.com');
        cy.get('.u_QCSTHkvFLIVpGoguc0 > form > .MuiFormControl-root').eq(2).find('.MuiInputBase-root > .MuiInputBase-input').click();
        cy.get('.u_QCSTHkvFLIVpGoguc0 > form > .MuiFormControl-root').eq(2).find('.MuiInputBase-root > .MuiInputBase-input').type('CypressTest1');
        cy.get('.MuiContainer-root > .d5Iqr4Hr_KswpjgdaQ3C > .u_QCSTHkvFLIVpGoguc0 > form > .MuiButtonBase-root').click();
    });   
});
   
describe('Login', () => {
    it('passes', () => {
        cy.viewport(1710, 948);
        cy.visit('http://localhost:8082/login');
        cy.get('.Ya4lhXp5Fb_4KVGtJDrV > form > .MuiFormControl-root').eq(0).find('.MuiInputBase-root > .MuiInputBase-input').click();
        cy.get('.Ya4lhXp5Fb_4KVGtJDrV > form > .MuiFormControl-root').eq(0).find('.MuiInputBase-root > .MuiInputBase-input').type('CypressTest1');
        cy.get('.Ya4lhXp5Fb_4KVGtJDrV > form > .MuiFormControl-root').eq(1).find('.MuiInputBase-root > .MuiInputBase-input').click();
        cy.get('.Ya4lhXp5Fb_4KVGtJDrV > form > .MuiFormControl-root').eq(1).find('.MuiInputBase-root > .MuiInputBase-input').type('CypressTest1');
        cy.get('.MuiContainer-root > .d5Iqr4Hr_KswpjgdaQ3C > .Ya4lhXp5Fb_4KVGtJDrV > form > .MuiButtonBase-root').click();
    });
});

// describe('Edit profile', () => {
//     it('passes', ()  => {
//         cy.viewport(1710, 948);
//         cy.visit('http://localhost:8082/my-account');
//         cy.get('.cCywpriAWfC5rZb8oRYj > .TaiEAfjFHIDhYaEWbfjw > .h5fHkOb7xTDUuHKImbT7 > div:nth-child(3) > input').click();
//         cy.get('.cCywpriAWfC5rZb8oRYj > .TaiEAfjFHIDhYaEWbfjw > .h5fHkOb7xTDUuHKImbT7 > div:nth-child(3) > input').type('cypress@change.com');
//         cy.get('.cCywpriAWfC5rZb8oRYj > .TaiEAfjFHIDhYaEWbfjw > .h5fHkOb7xTDUuHKImbT7 > div:nth-child(4) > input').click();
//         cy.get('.cCywpriAWfC5rZb8oRYj > .TaiEAfjFHIDhYaEWbfjw > .h5fHkOb7xTDUuHKImbT7 > div:nth-child(4) > input').type('CypressTestName');
//         cy.get('.cCywpriAWfC5rZb8oRYj > .TaiEAfjFHIDhYaEWbfjw > .h5fHkOb7xTDUuHKImbT7 > div:nth-child(5) > input').click();
//         cy.get('.cCywpriAWfC5rZb8oRYj > .TaiEAfjFHIDhYaEWbfjw > .h5fHkOb7xTDUuHKImbT7 > div:nth-child(5) > input').type('Berlin');
//         cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .TaiEAfjFHIDhYaEWbfjw > .h5fHkOb7xTDUuHKImbT7 > div:nth-child(5)').click();
//         cy.get('.MuiFormControl-root').click();
//         cy.get('body > #menu- > .MuiPaper-root > .MuiList-root > .MuiButtonBase-root:nth-child(1)').click();
//         cy.get('body > #menu- > .MuiPaper-root > .MuiList-root > .MuiButtonBase-root:nth-child(2)').click();
//         cy.get('body > #menu- > .MuiPaper-root > .MuiList-root > .MuiButtonBase-root:nth-child(3)').click();
//         cy.get('body > #menu- > .MuiBackdrop-root').click();
//         cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .TaiEAfjFHIDhYaEWbfjw > .h5fHkOb7xTDUuHKImbT7 > button').click();
//     });   
// });
   

describe('Logout', () => {
    it('passes', () => {
        cy.viewport(1710, 948);
        cy.visit('http://localhost:8082/');
        cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .jgdtqJiol3q8AD6AO_6l > .BeRjX90Zejj_RRtK0TjB > a').click();
        cy.contains('Login');
    });
});
   
   