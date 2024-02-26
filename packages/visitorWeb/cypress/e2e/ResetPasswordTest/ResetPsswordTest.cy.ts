describe('Reset password', () => {
    it('passes', () => {
        cy.viewport(1710, 948);
        cy.visit('http://localhost:8082/');
        cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .jgdtqJiol3q8AD6AO_6l > .BeRjX90Zejj_RRtK0TjB > a').click();
        cy.get('.d5Iqr4Hr_KswpjgdaQ3C > .Ya4lhXp5Fb_4KVGtJDrV > form > .n9NneHtW52Iramqkd4mx:nth-child(4) > .mUi5TtzSixkfc6ylvswE').click();
        cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .Ilb_eR9TKZmC9iXc6qAv > div > #emailInput').click();
        cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .Ilb_eR9TKZmC9iXc6qAv > div > #emailInput').type('username@email.com');
        cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .Ilb_eR9TKZmC9iXc6qAv > div > .hskZqUutaTbHMnYq70JV').click();
        cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .Ilb_eR9TKZmC9iXc6qAv > div > #usernameInput').click();
        cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .Ilb_eR9TKZmC9iXc6qAv > div > #usernameInput').type('Username');
        cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .Ilb_eR9TKZmC9iXc6qAv > div > .hskZqUutaTbHMnYq70JV').click();
        cy.visit('http://localhost:8082/login');
    });
});
   

describe('user data typo', () => {
    it('passes', () => {
        cy.viewport(1710, 948);
        cy.visit('http://localhost:8082/');
        cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .jgdtqJiol3q8AD6AO_6l > .BeRjX90Zejj_RRtK0TjB > a').click();
        cy.get('.d5Iqr4Hr_KswpjgdaQ3C > .Ya4lhXp5Fb_4KVGtJDrV > form > .n9NneHtW52Iramqkd4mx:nth-child(4) > .mUi5TtzSixkfc6ylvswE').click();
        cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .Ilb_eR9TKZmC9iXc6qAv > div > #emailInput').click();
        cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .Ilb_eR9TKZmC9iXc6qAv > div > #emailInput').type('username@emai.com');
        cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .Ilb_eR9TKZmC9iXc6qAv > div > .hskZqUutaTbHMnYq70JV').click();
        cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .Ilb_eR9TKZmC9iXc6qAv > div > #usernameInput').click();
        cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .Ilb_eR9TKZmC9iXc6qAv > div > #usernameInput').type('username');
        cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .Ilb_eR9TKZmC9iXc6qAv > div > .hskZqUutaTbHMnYq70JV').click();
        cy.contains('That username and email (username@emai.com) don\'t match. Please check its spelling or try another username.');
    });
});
           
   