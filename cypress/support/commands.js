// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
/// <reference types='cypress' />

Cypress.Commands.add('clickButton', (buttonText) => {
  cy.get(`[ng-click="${buttonText}()"]`).click();
});

Cypress.Commands.add('login', (userName) => {
  cy.clickButton('customer');
  cy.get('#userSelect').select(userName);
  cy.get('[type=submit]').click();
});

Cypress.Commands.add('logout', () => {
  cy.clickButton('byebye');
});

Cypress.Commands.add('assertAccountProperty', (property, value) => {
  cy.contains('[ng-hide="noAccount"]', property)
    .contains('strong', value)
    .should('be.visible');
});

Cypress.Commands.add('makeDeposit', (amount) => {
  cy.clickButton('deposit');
  cy.get('[placeholder="amount"]').type(`${amount}`);
  cy.contains('[type="submit"]', 'Deposit').click();
});

Cypress.Commands.add('assertSuccessMessage', (message) => {
  cy.get('[ng-show="message"]').should('have.text', message);
});

Cypress.Commands.add('makeWithdrawal', (amount) => {
  cy.clickButton('withdrawl');
  cy.contains('[type="submit"]', 'Withdraw').should('be.visible');
  cy.get('[placeholder="amount"]').type(`${amount}`);
  cy.contains('[type="submit"]', 'Withdraw').click();
});

Cypress.Commands.add('assertTransactionDetails', (
  rowNumber, amount, transactionType
) => {
  cy.get('table tbody tr')
    .eq(rowNumber)
    .find('td')
    .eq(1)
    .should('have.text', amount)
    .next()
    .should('have.text', transactionType);
});
