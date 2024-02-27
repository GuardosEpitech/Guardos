import {login} from '../../fixtures/login';

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
        cy.wait(1000);
        cy.url().should('eq', 'http://localhost:8082/login');
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
        cy.wait(1000);
        cy.url().should('eq', 'http://localhost:8082/');
        cy.contains('Logout');
    });
});

describe('Edit Email', function() {
    it('passes', function() {
       cy.viewport(1710, 948);
       login('CypressTest1', 'CypressTest1');
       cy.visit('http://localhost:8082/my-account');
       cy.wait(1000);
       cy.get('.cCywpriAWfC5rZb8oRYj > .TaiEAfjFHIDhYaEWbfjw > .h5fHkOb7xTDUuHKImbT7 > div:nth-child(3) > .t32YvAl3h5jpNxRDNa4l').click();
       cy.get('.cCywpriAWfC5rZb8oRYj > .TaiEAfjFHIDhYaEWbfjw > .h5fHkOb7xTDUuHKImbT7 > div:nth-child(3) > .t32YvAl3h5jpNxRDNa4l').clear();
       cy.get('.cCywpriAWfC5rZb8oRYj > .TaiEAfjFHIDhYaEWbfjw > .h5fHkOb7xTDUuHKImbT7 > div:nth-child(3) > .t32YvAl3h5jpNxRDNa4l').type('cypress1changed@email.com');
       cy.get('.cCywpriAWfC5rZb8oRYj > .TaiEAfjFHIDhYaEWbfjw > .h5fHkOb7xTDUuHKImbT7 > div > .YBHP8vI2UcLjmVrRdulb').click();
       cy.contains('Profile details changed successfully!');
    });
})

describe('Edit Username', function() {
    it('passes', function() {
        cy.viewport(1710, 948);
        login('CypressTest1', 'CypressTest1')
        cy.visit('http://localhost:8082/my-account');
        cy.wait(1000);
        cy.get('.cCywpriAWfC5rZb8oRYj > .TaiEAfjFHIDhYaEWbfjw > .h5fHkOb7xTDUuHKImbT7 > div:nth-child(4) > .t32YvAl3h5jpNxRDNa4l').click();
        cy.get('.cCywpriAWfC5rZb8oRYj > .TaiEAfjFHIDhYaEWbfjw > .h5fHkOb7xTDUuHKImbT7 > div:nth-child(4) > .t32YvAl3h5jpNxRDNa4l').clear();
        cy.get('.cCywpriAWfC5rZb8oRYj > .TaiEAfjFHIDhYaEWbfjw > .h5fHkOb7xTDUuHKImbT7 > div:nth-child(4) > .t32YvAl3h5jpNxRDNa4l').type('CypressTest1Changed');
        cy.get('.cCywpriAWfC5rZb8oRYj > .TaiEAfjFHIDhYaEWbfjw > .h5fHkOb7xTDUuHKImbT7 > div > .YBHP8vI2UcLjmVrRdulb').click();
        cy.contains('Profile details changed successfully!');
    });
})

describe('Edit Location', function() {
    it('should edit Location', function() {
        cy.viewport(1710, 948);
        login('CypressTest1Changed', 'CypressTest1');
        cy.visit('http://localhost:8082/my-account');
        cy.wait(1000);
        cy.get('.cCywpriAWfC5rZb8oRYj > .TaiEAfjFHIDhYaEWbfjw > .h5fHkOb7xTDUuHKImbT7 > div:nth-child(5) > .t32YvAl3h5jpNxRDNa4l').click();
        cy.get('.cCywpriAWfC5rZb8oRYj > .TaiEAfjFHIDhYaEWbfjw > .h5fHkOb7xTDUuHKImbT7 > div:nth-child(5) > .t32YvAl3h5jpNxRDNa4l').clear();
        cy.get('.cCywpriAWfC5rZb8oRYj > .TaiEAfjFHIDhYaEWbfjw > .h5fHkOb7xTDUuHKImbT7 > div:nth-child(5) > .t32YvAl3h5jpNxRDNa4l').type('Berlin');
        cy.get('.cCywpriAWfC5rZb8oRYj > .TaiEAfjFHIDhYaEWbfjw > .h5fHkOb7xTDUuHKImbT7 > div > .YBHP8vI2UcLjmVrRdulb').click();
        cy.contains('Profile details changed successfully!');
    });
})

describe('Edit Allergens', function() {
    it('passes', function() {
        cy.viewport(1710, 948);
        login('CypressTest1Changed', 'CypressTest1');
        cy.visit('http://localhost:8082/my-account');
        cy.wait(1000);
        cy.get('.cCywpriAWfC5rZb8oRYj > .TaiEAfjFHIDhYaEWbfjw > .h5fHkOb7xTDUuHKImbT7 > div:nth-child(6) > .MuiFormControl-root').click();
        cy.get('body > #menu- > .MuiPaper-root > .MuiList-root > .MuiButtonBase-root:nth-child(2)').click();
        cy.get('body > #menu- > .MuiBackdrop-root').click();
        cy.get('.cCywpriAWfC5rZb8oRYj > .TaiEAfjFHIDhYaEWbfjw > .h5fHkOb7xTDUuHKImbT7 > div > .YBHP8vI2UcLjmVrRdulb').click();
        cy.contains('Profile details changed successfully!');
    });
})

describe('Edit Language', function() {
     it('passes', function() {
        cy.viewport(1710, 948);
        login('CypressTest1Changed', 'CypressTest1');
        cy.visit('http://localhost:8082/my-account');
        cy.wait(1000);
        cy.get('.cCywpriAWfC5rZb8oRYj > .TaiEAfjFHIDhYaEWbfjw > .h5fHkOb7xTDUuHKImbT7 > .MuiFormControl-root').click();
        cy.get('body > #menu- > .MuiPaper-root > .MuiList-root > .MuiButtonBase-root:nth-child(1)').click();
        cy.get('.cCywpriAWfC5rZb8oRYj > .TaiEAfjFHIDhYaEWbfjw > .h5fHkOb7xTDUuHKImbT7 > div > .YBHP8vI2UcLjmVrRdulb').click();
        cy.contains('Profile details changed successfully!');
     });
})   

describe('Edit Password', function() {
    it('passes', function() {
        cy.viewport(1710, 948);
        login('CypressTest1Changed', 'CypressTest1');
        cy.visit('http://localhost:8082/my-account');
        cy.wait(1000);
        cy.get('.cCywpriAWfC5rZb8oRYj > .TaiEAfjFHIDhYaEWbfjw > .h5fHkOb7xTDUuHKImbT7 > .FxtKjtchOY2HLiSS7znx > .N_XWBgnNrLmlpk0tKX9j').click();
        cy.get('.pSBeJcHhs0cgSHHFcWgF > div > .MuiFormControl-root:nth-child(1) > .MuiInputBase-root > .MuiInputBase-input').click();
        cy.get('.pSBeJcHhs0cgSHHFcWgF > div > .MuiFormControl-root:nth-child(1) > .MuiInputBase-root > .MuiInputBase-input').type('CypressTest1');
        cy.get('.pSBeJcHhs0cgSHHFcWgF > div > .MuiFormControl-root:nth-child(2) > .MuiInputBase-root > .MuiInputBase-input').click();
        cy.get('.pSBeJcHhs0cgSHHFcWgF > div > .MuiFormControl-root:nth-child(2) > .MuiInputBase-root > .MuiInputBase-input').type('PasswordChange1');
        cy.get('.pSBeJcHhs0cgSHHFcWgF > div > .MuiFormControl-root:nth-child(3) > .MuiInputBase-root > .MuiInputBase-input').click();
        cy.get('.pSBeJcHhs0cgSHHFcWgF > div > .MuiFormControl-root:nth-child(3) > .MuiInputBase-root > .MuiInputBase-input').type('PasswordChange1');
        cy.get('.h5fHkOb7xTDUuHKImbT7 > .pSBeJcHhs0cgSHHFcWgF > div > div > .YBHP8vI2UcLjmVrRdulb').click();
        cy.contains('Password changed successfully!');
    });
})
   

describe('Logout', () => {
    it('passes', () => {
        cy.viewport(1710, 948);
        login('CypressTest1Changed', 'PasswordChange1');
        cy.visit('http://localhost:8082/');
        cy.wait(1000);
        cy.contains('Logout');
        cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .jgdtqJiol3q8AD6AO_6l > .BeRjX90Zejj_RRtK0TjB > a').click();
        cy.contains('Login');
    });
});

describe('delete Account', function() {
    it('passes', function() {
        cy.viewport(1710, 948);
        login('CypressTest1Changed', 'PasswordChange1');
        cy.visit('http://localhost:8082/my-account');
        cy.wait(1000);
        cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .TaiEAfjFHIDhYaEWbfjw > .h5fHkOb7xTDUuHKImbT7 > .b3PcCr0BwQwv3F0E3DMj').click();
        cy.get('.MuiDialog-root > .MuiDialog-container > .MuiPaper-root > .MuiDialogActions-root > .MuiButtonBase-root:nth-child(2)').click();
        cy.url().should('eq', 'http://localhost:8082/');
    })
   
   })
   
   