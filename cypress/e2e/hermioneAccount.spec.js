/// <reference types='cypress' />

// Function to perform a deposit
export function performDeposit(amount) {
  cy.get('[ng-click="deposit()"]').click();
  cy.get('[placeholder="amount"]').type(amount);
  cy.contains('[type="submit"]', 'Deposit').click();

  cy.get('[ng-show="message"]').should('contain', 'Deposit Successful');
}

// Function to perform a withdrawal
export function performWithdrawal(amount) {
  cy.get('[ng-click="withdrawl()"]').click();
  cy.contains('[type="submit"]', 'Withdraw').should('be.visible');
  cy.get('[placeholder="amount"]').type(amount);
  cy.contains('[type="submit"]', 'Withdraw').click();

  cy.get('[ng-show="message"]').should('contain', 'Transaction successful');
}
