describe('slect filter', function() {
  it('passes', function() {
    cy.viewport(1710, 948)
    cy.visit('http://localhost:8082/');  
    cy.get('div > .zfKNfdHc4YwKOorEZYMV > .MuiFormControlLabel-root:nth-child(1) > .MuiButtonBase-root > .PrivateSwitchBase-input').click();  
    cy.get('div > .zfKNfdHc4YwKOorEZYMV > .MuiFormControlLabel-root:nth-child(1) > .MuiButtonBase-root > .PrivateSwitchBase-input').check('on'); 
    cy.get('div > .zfKNfdHc4YwKOorEZYMV > .MuiFormControlLabel-root:nth-child(2) > .MuiButtonBase-root > .PrivateSwitchBase-input').click(); 
    cy.get('div > .zfKNfdHc4YwKOorEZYMV > .MuiFormControlLabel-root:nth-child(2) > .MuiButtonBase-root > .PrivateSwitchBase-input').check('on');  
    cy.get('div > .zfKNfdHc4YwKOorEZYMV > .MuiFormControlLabel-root:nth-child(3) > .MuiButtonBase-root > .PrivateSwitchBase-input').click();  
    cy.get('div > .zfKNfdHc4YwKOorEZYMV > .MuiFormControlLabel-root:nth-child(3) > .MuiButtonBase-root > .PrivateSwitchBase-input').check('on');  
    cy.get('div > .zfKNfdHc4YwKOorEZYMV > .MuiFormControlLabel-root:nth-child(5) > .MuiButtonBase-root > .PrivateSwitchBase-input').click(); 
    cy.get('div > .zfKNfdHc4YwKOorEZYMV > .MuiFormControlLabel-root:nth-child(5) > .MuiButtonBase-root > .PrivateSwitchBase-input').check('on'); 
    cy.get('div > .zfKNfdHc4YwKOorEZYMV > .MuiFormControlLabel-root:nth-child(4) > .MuiButtonBase-root > .PrivateSwitchBase-input').click();  
    cy.get('div > .zfKNfdHc4YwKOorEZYMV > .MuiFormControlLabel-root:nth-child(4) > .MuiButtonBase-root > .PrivateSwitchBase-input').check('on'); 
    cy.get('.rz0OEUQyXyPi4ZptugSL > .W20SsNtkSwbHcQI79H44 > div > .MuiStack-root > .MuiButtonBase-root:nth-child(1)').click();  
    cy.get('.rz0OEUQyXyPi4ZptugSL > .W20SsNtkSwbHcQI79H44 > div > .MuiStack-root > .MuiButtonBase-root:nth-child(2)').click(); 
    cy.get('.W20SsNtkSwbHcQI79H44 > div > .MuiStack-root > .MuiButtonBase-root:nth-child(3) > .MuiChip-label').click();  
    cy.get('.W20SsNtkSwbHcQI79H44 > div > .MuiStack-root > .MuiButtonBase-root:nth-child(4) > .MuiChip-label').click();  
    cy.get('.W20SsNtkSwbHcQI79H44 > div > .MuiStack-root > .MuiButtonBase-root:nth-child(5) > .MuiChip-label').click();  
    cy.get('.W20SsNtkSwbHcQI79H44 > div > .MuiStack-root > .MuiButtonBase-root:nth-child(6) > .MuiChip-label').click();  
    cy.get('.W20SsNtkSwbHcQI79H44 > div > .MuiStack-root > .MuiButtonBase-root:nth-child(7) > .MuiChip-label').click();  
    cy.get('.W20SsNtkSwbHcQI79H44 > div > .MuiStack-root > .MuiButtonBase-root:nth-child(10) > .MuiChip-label').click();  
    cy.get('.W20SsNtkSwbHcQI79H44 > div > .MuiStack-root > .MuiButtonBase-root:nth-child(9) > .MuiChip-label').click();  
    cy.get('.W20SsNtkSwbHcQI79H44 > div > .MuiStack-root > .MuiButtonBase-root:nth-child(8) > .MuiChip-label').click();  
    cy.get('.W20SsNtkSwbHcQI79H44 > div > .MuiStack-root > .MuiButtonBase-root:nth-child(11) > .MuiChip-label').click();  
    cy.get('.W20SsNtkSwbHcQI79H44 > div > .MuiStack-root > .MuiButtonBase-root:nth-child(12) > .MuiChip-label').click();
    cy.get('.rz0OEUQyXyPi4ZptugSL > .W20SsNtkSwbHcQI79H44 > div > .MuiStack-root > .MuiButtonBase-root:nth-child(13)').click();
    cy.get('.W20SsNtkSwbHcQI79H44 > div > .MuiStack-root > .MuiButtonBase-root:nth-child(14) > .MuiChip-label').click();
    cy.get('.k0IR3UUQpAOK89Ho2sOv > .uRX0GiL3Z7juc1xF_OJy > .MuiBox-root > .MuiSlider-root > .MuiSlider-thumb').click();
    cy.get('div > .XojcE8IycS3UZU1BxplA > .MuiBox-root > .MuiRating-root > .css-dqr9h-MuiRating-label:nth-child(9)').click();
    cy.get('div > .XojcE8IycS3UZU1BxplA > .MuiBox-root > .MuiRating-root > .MuiRating-visuallyHidden:nth-child(5)').type('5');
  });
});
 

