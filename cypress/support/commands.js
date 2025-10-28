/// <reference types='cypress' />

Cypress.Commands.add('clickButton', (buttonName) => {
  cy.get(`[ng-click="${buttonName}()"]`).click();
});

Cypress.Commands.add('loginUser', (userName) => {
  cy.clickButton('customer');
  cy.get('#userSelect').select(userName);
  cy.get('[type="submit"]').click();
});

Cypress.Commands.add('logoutUser', () => {
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

Cypress.Commands.add('makeWithdrawal', (amount) => {
  cy.clickButton('withdrawl');
  cy.contains('[type="submit"]', 'Withdraw')
    .should('be.visible');
  cy.get('[placeholder="amount"]').type(amount);
  cy.contains('[type="submit"]', 'Withdraw').click();
});

Cypress.Commands.add('assertSuccessMessage', (message) => {
  cy.get('span[ng-show="message"]')
    .should('have.text', message);
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
