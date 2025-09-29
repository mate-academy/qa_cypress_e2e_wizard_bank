/// <reference types="cypress" />

describe('Example test', () => {
  it('visits the page and performs actions', () => {
    cy.visit('/');

    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="password"]').type('password');

    cy.get('form')
      .contains('button', 'Login')
      .click();

    cy.get('h1')
      .should('contain.text', 'Welcome to the Dashboard');

    cy.get('.dashboard-item').first().click();

    cy.get('.modal')
      .should('be.visible');

    cy.get('.modal')
      .contains('button', 'Confirm')
      .click();
  });
});
