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

Cypress.Commands.add('clickButton', (buttonName) => {
  cy.get(`[ng-click="${buttonName}()"]`).click();
});

Cypress.Commands.add('loginUser', (userName) => {
  cy.clickButton('customer');
  cy.get('#userSelect').select(userName);
  cy.get('[type="submit"]').click();
});

Cypress.Commands.add('assertAccountDetails', (label, value) => {
  cy.contains('[ng-hide="noAccount"]', label)
    .contains('strong', value)
    .should('be.visible');
});

Cypress.Commands.add('getBalance', () => {
  return cy.get('[ng-hide="noAccount"]')
    .find('strong')
    .eq(1)
    .invoke('text')
    .then((text) => Number(text.trim()));
});

Cypress.Commands.add('toDeposit', (amount) => {
  cy.clickButton('deposit');
  cy.get('[placeholder="amount"]').type(amount);
  cy.contains('[type="submit"]', 'Deposit').click();
});

Cypress.Commands.add('doWithdrawal', (amount) => {
  cy.clickButton('withdrawl');
  cy.contains('[type="submit"]', 'Withdraw').should('be.visible');
  cy.get('[placeholder="amount"]').type(amount);
  cy.contains('[type="submit"]', 'Withdraw').click();
});

Cypress.Commands.add('assertBalanceChange', (action, expectedChange) => {
  cy.getBalance().then((before) => {
    action();
    cy.getBalance().should('equal', before + expectedChange);
  });
});

Cypress.Commands.add('assertTransactionDetails',
  (rowNumber = -1, amount, transactionType) => {
    cy.get('table tbody tr', { timeout: 10000 })
      .should('have.length.at.least', 1)
      .eq(rowNumber)
      .within(() => {
        cy.get('td').eq(1).should('have.text', String(amount));
        cy.get('td').eq(2).should('have.text', transactionType);
      });
  });

Cypress.Commands.add('logoutUser', () => {
  cy.clickButton('byebye');
  cy.get('#userSelect').should('be.visible');
});
