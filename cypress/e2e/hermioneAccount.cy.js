/// <reference types='cypress' />

describe('Bank app', () => {
  const user = 'Hermoine Granger';
  const accountNumber = '1001';

  const initialBalance = 5096;
  const depositValue = Math.floor((Math.random() * 50) + 10);
  const withdrawValue = Math.floor((Math.random() * 50) + 10);

  const balanceWithDeposit = initialBalance + depositValue;
  const balanceAfterWithdrawal = balanceWithDeposit - withdrawValue;

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    // Login as Hermione Granger
    cy.contains('button', 'Customer Login').click();
    cy.get('#userSelect').select(user);
    cy.contains('button', 'Login').click();

    // Assert Account Number, Balance, and Currency
    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .should('contain', accountNumber);
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .should('contain', initialBalance);
    cy.contains('[ng-hide="noAccount"]', 'Currency')
      .should('contain', 'Dollar');

    // Make a Deposit
    cy.get('[ng-click="deposit()"]').click();
    cy.findByPlaceholder('amount').type(depositValue);
    cy.contains('[type="submit"]', 'Deposit').click();
    cy.contains('[ng-show="message"]', 'Deposit Successful').should('exist');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .should('contain', balanceWithDeposit);

    // Make a Withdrawal
    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('label', 'Amount to be Withdrawn').should('exist');
    cy.findByPlaceholder('amount').type(withdrawValue);
    cy.contains('[type="submit"]', 'Withdraw').click();
    cy.contains('[ng-show="message"]', 'Transaction successful')
      .should('exist');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .should('contain', balanceAfterWithdrawal);

    // Assert Deposite and Withdrawal details
    cy.wait(1000);
    cy.get('[ng-click="transactions()"]').click();
    cy.get('table')
      .should('contain', depositValue)
      .and('contain', withdrawValue);
    cy.get('[ng-click="back()"]').click();

    // Transactions in Another Account
    cy.get('#accountSelect').select('1002');
    cy.get('[ng-click="transactions()"]').click();
    cy.get('tbody').contains('tx').should('not.exist');

    // Logout
    cy.get('.logout').click();
    cy.get('#userSelect').should('exist');
  });
});
