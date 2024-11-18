import { faker } from '@faker-js/faker';
/// <reference types='cypress' />

describe('Bank app', () => {
  const accountBalance = 5096;
  const depositAmount = faker.number.int({ min: 500, max: 1000 });
  const withdrawAmount = faker.number.int({ min: 50, max: 500 });
  const balanceAfterDeposit = accountBalance + depositAmount;
  const balanceAfterWithdraw = balanceAfterDeposit - withdrawAmount;
  const user = 'Hermoine Granger';
  const accountNumber = 1001;
  const changeAccountNumber = 1003;

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with bank account', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('[name="userSelect"]').select(user);
    cy.contains('.btn', 'Login').click();

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', accountNumber)
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', accountBalance)
      .should('be.visible');
    cy.contains('.ng-binding', 'Dollar')
      .should('be.visible');

    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type(depositAmount);
    cy.contains('[type="submit"]', 'Deposit').click();

    cy.get('[ng-show="message"]')
      .should('contain', 'Deposit Successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balanceAfterDeposit)
      .should('be.visible');

    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw')
      .should('be.visible');
    cy.get('[placeholder="amount"]').type(withdrawAmount);
    cy.contains('[type="submit"]', 'Withdraw').click();

    cy.get('[ng-show="message"]')
      .should('contain', 'Transaction successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balanceAfterWithdraw)
      .should('be.visible');

    cy.reload();
    cy.get('[ng-click="transactions()"]').click();
    cy.get(':nth-child(1) > a').click();
    cy.contains('tr', 'Credit').should('contain', depositAmount);
    cy.contains('tr', 'Debit').should('contain', withdrawAmount);

    cy.get('[ng-click="back()"]').click();
    cy.get('#accountSelect').select(`number:${changeAccountNumber}`);
    cy.get('.borderM > :nth-child(3) > :nth-child(1)')
      .contains(changeAccountNumber);

    cy.get('[ng-click="transactions()"]').click();

    cy.contains('tr', 'Credit').should('not.exist');
    cy.contains('tr', 'Debit').should('not.exist');

    cy.get('[ng-click="byebye()"]').click();
    cy.get('[name="userSelect"]').should('be.visible');
  });
});
