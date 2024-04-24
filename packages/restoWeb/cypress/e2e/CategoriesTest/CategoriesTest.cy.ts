import {loginFull} from '../../fixtures/login';

describe('Categories Test', function() {
    it('adds a Category ', function() {
        loginFull("gylian", "gylianN1");
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
   