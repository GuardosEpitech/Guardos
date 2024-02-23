describe('Reset Password', () => {
    it('passes', () => {
        cy.viewport(1710, 948);
        cy.visit('http://localhost:8080/')    ;
        cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .s9cXdLQktnIOI47u4iZ0 > .X2wsGgbkixL6sNpfFziQ > a').click();
        cy.get('.d5Iqr4Hr_KswpjgdaQ3C > .Ya4lhXp5Fb_4KVGtJDrV > form > .n9NneHtW52Iramqkd4mx:nth-child(4) > .mUi5TtzSixkfc6ylvswE').click();
        cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .Ilb_eR9TKZmC9iXc6qAv > div > #emailInput').click();
        cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .Ilb_eR9TKZmC9iXc6qAv > div > #emailInput').type('username@email.com');
        cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .Ilb_eR9TKZmC9iXc6qAv > div > .hskZqUutaTbHMnYq70JV').click();
        cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .Ilb_eR9TKZmC9iXc6qAv > div > #usernameInput').click();
        cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .Ilb_eR9TKZmC9iXc6qAv > div > #usernameInput').type('Username');
        cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .Ilb_eR9TKZmC9iXc6qAv > div > .hskZqUutaTbHMnYq70JV').click();
        cy.visit('http://localhost:8080/login');
    });
});

describe('user data typo', () => {
    it('passes', () => {
        cy.viewport(1710, 948);
        cy.visit('http://localhost:8080/');
        cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .s9cXdLQktnIOI47u4iZ0 > .X2wsGgbkixL6sNpfFziQ > a').click();
        cy.get('.d5Iqr4Hr_KswpjgdaQ3C > .Ya4lhXp5Fb_4KVGtJDrV > form > .n9NneHtW52Iramqkd4mx:nth-child(4) > .mUi5TtzSixkfc6ylvswE').click();
        cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .Ilb_eR9TKZmC9iXc6qAv > div > #emailInput').click();
        cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .Ilb_eR9TKZmC9iXc6qAv > div > #emailInput').type('username@emai.com');
        cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .Ilb_eR9TKZmC9iXc6qAv > div > .hskZqUutaTbHMnYq70JV').click();
        cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .Ilb_eR9TKZmC9iXc6qAv > div > #usernameInput').click();
        cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .Ilb_eR9TKZmC9iXc6qAv > div > #usernameInput').type('Usernaem');
        cy.get('.V3JgFjoBAN8BwxEGAGJx > .cCywpriAWfC5rZb8oRYj > .Ilb_eR9TKZmC9iXc6qAv > div > .hskZqUutaTbHMnYq70JV').click();
        cy.contains('That username and email (username@emai.com) don\'t match. Please check its spelling or try another username.');
    });
});
   