import { faker } from '@faker-js/faker';
/// <reference types='cypress' />

describe('Bank app', () => {
  const username = 'Hermoine Granger';
  const account = '1001';
  const accountBalance = 5096;
  const depositAmount = faker.number.int(5000);
  const balanceAfterDeposit = accountBalance + depositAmount;
  const withdrawAmount = faker.number.int({ min: 1, max: balanceAfterDeposit });
  const balanceAfterWithdraw = balanceAfterDeposit - withdrawAmount;

  beforeEach(() => {
    cy.visit('/#/login');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('[name="userSelect"]').select(username);
    cy.contains('.btn', 'Login').click();

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', account)
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Balance : ')
      .contains('strong', accountBalance)
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Currency')
      .contains('strong', 'Dollar')
      .should('be.visible');

    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type(depositAmount);
    cy.contains('button[type="submit"]', 'Deposit').click();
    cy.get('[ng-show="message"]')
      .should('contain', 'Deposit Successful');

    cy.contains('[ng-hide="noAccount"]', 'Balance : ')
      .contains('strong', balanceAfterDeposit)
      .should('be.visible');

    cy.get('[ng-click="withdrawl()"]').click();

    cy.get('[ng-model="amount"]').type(withdrawAmount);
    cy.contains('button[type="submit"]', 'Withdraw').click();
    cy.get('[ng-show="message"]')
      .should('contain', 'Transaction successful');

    cy.contains('[ng-hide="noAccount"]', 'Balance : ')
      .contains('strong', balanceAfterWithdraw)
      .should('be.visible');

    cy.get('[ng-click="transactions()"]').click();
    cy.get('[ng-click="back()"]').click();

    cy.get('[ng-click="transactions()"]').click();
    cy.get('#start').type('2024-10-14T18:20:00');
    cy.contains('tr', 'Credit').should('contain', depositAmount);
    cy.contains('tr', 'Debit').should('contain', withdrawAmount);

    cy.get('[ng-click="back()"]').click();

    cy.get('#accountSelect').select('1003');
    cy.get('[ng-click="transactions()"]').click();
    cy.contains('tr', 'Credit').should('not.exist');
    cy.contains('tr', 'Debit').should('not.exist');

    cy.get('[ng-click="byebye()"]').click();
    cy.get('#userSelect').should('be.visible');
  });
});
