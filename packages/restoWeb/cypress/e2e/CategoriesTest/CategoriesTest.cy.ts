const login = (email:string) => {
    cy.session(email, () => {
        cy.viewport(1710, 948);
        cy.visit('http://localhost:8080/login');
        cy.wait(100);
        cy.get('#\\:r0\\:').type(email);
        cy.wait(100);
        cy.get('#\\:r1\\:').type('gylianN1');
        cy.get('.MuiButtonBase-root').click();
        cy.wait(3000);
    })
  }

describe('Categories Test', function() {
    it('adds a Category ', function() {
        login("gylian");
        cy.viewport(1710, 948);
        cy.visit('http://localhost:8080/addCategory');
        cy.wait(5000);
        cy.get('.App > .V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .A3JOLTAJzvXWT10itR0S > select').select('40');
        cy.get('.cCywpriAWfC5rZb8oRYj > .A3JOLTAJzvXWT10itR0S > .B9_xLt9NaKGN8IGB5XnJ > .vZhGZthjTo2UUQSpdDDh > button').click();
        cy.get('.cCywpriAWfC5rZb8oRYj > .A3JOLTAJzvXWT10itR0S > .B9_xLt9NaKGN8IGB5XnJ > .keiQdm5HezRUBsh87w_7 > input:nth-child(1)').click();
        cy.get('.cCywpriAWfC5rZb8oRYj > .A3JOLTAJzvXWT10itR0S > .B9_xLt9NaKGN8IGB5XnJ > .keiQdm5HezRUBsh87w_7 > input:nth-child(1)').type('add FrontEnd Test');
        cy.get('.cCywpriAWfC5rZb8oRYj > .A3JOLTAJzvXWT10itR0S > .B9_xLt9NaKGN8IGB5XnJ > .keiQdm5HezRUBsh87w_7 > input:nth-child(2)').click();
        cy.get('.cCywpriAWfC5rZb8oRYj > .A3JOLTAJzvXWT10itR0S > .B9_xLt9NaKGN8IGB5XnJ > .keiQdm5HezRUBsh87w_7 > input:nth-child(2)').type('2');
        cy.get('.cCywpriAWfC5rZb8oRYj > .A3JOLTAJzvXWT10itR0S > .B9_xLt9NaKGN8IGB5XnJ > .keiQdm5HezRUBsh87w_7 > button').click();
    });
   
   });
   