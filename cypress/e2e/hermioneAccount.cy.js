/// <reference types='cypress' />

describe('Bank app', () => {
  const depositAmount = 2000;
  const withdrawAmount = 200;
  let balance = 5096;
  const user = 'Hermoine Granger';
  const firstAccountNumber = '1001';
  const secoundAccountNumber = '1002';

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with bank account', () => {
    // Customer Login
    cy.contains('.btn', 'Customer Login').click();
    cy.get('[name="userSelect"]').select(user);
    cy.contains('.btn', 'Login').click();

    // // Assert Account Number, Balance, and Currency
    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', firstAccountNumber)
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', String(balance))
      .should('be.visible');
    cy.contains('.ng-binding', 'Dollar')
      .should('be.visible');

    // // Deposit
    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type(String(depositAmount));
    balance += depositAmount;
    cy.contains('[type="submit"]', 'Deposit').click();

    // // Assert Deposit Success and Balance
    cy.get('[ng-show="message"]')
      .should('contain', 'Deposit Successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', String(balance))
      .should('be.visible');

    // // Withdraw
    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('Amount to be Withdrawn :').should('be.visible');

    cy.get('input.form-control[type="number"]').type(String(withdrawAmount));
    balance -= withdrawAmount;
    cy.get('.btn.btn-default').contains('Withdraw').click();

    // // Assert Withdraw Success and Balance
    cy.get('[ng-show="message"]')
      .should('contain', 'Transaction successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', String(balance))
      .should('be.visible');

    // // Transactions
    cy.get('[ng-click="transactions()"]').click();
    cy.get('table').should('be.visible');

    cy.contains('.btn', 'Back').click();
    cy.get('[ng-click="transactions()"]').click();
    cy.get('table tbody').should('be.visible');
    cy.contains('a', 'Date-Time').should('be.visible');
    cy.contains('a', 'Date-Time').click({ force: true });

    cy.get('table tbody tr:nth-child(1) td:nth-child(2)')
      .should('contain', withdrawAmount);
    cy.get('table tbody tr:nth-child(1) td:nth-child(3)')
      .should('contain', 'Debit');
    cy.get('table tbody tr:nth-child(2) td:nth-child(2)')
      .should('contain', depositAmount);
    cy.get('table tbody tr:nth-child(2) td:nth-child(3)')
      .should('contain', 'Credit');

    // // Back
    cy.get('[ng-click="back()"]').click();

    // // Change Account Number
    cy.get('[name="accountSelect"]').select(secoundAccountNumber);
    cy.get('[ng-click="transactions()"]').click();
    cy.get('table tbody tr').should('have.length', 0);

    // // Back
    cy.get('[ng-click="back()"]').click();
    //
    // // Logout
    cy.get('[ng-click="byebye()"]').click();
    cy.get('[ng-click="byebye()"]').should('not.be.visible');
  });
});
