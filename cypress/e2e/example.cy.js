import { faker } from '@faker-js/faker';
/// <reference types='cypress' />

describe('Bank app', () => {
  const initialBalance = 5096;
  const depositAmount = `${faker.number.int({ min: 500, max: 1000 })}`;
  const balanceAfterDeposit = initialBalance + parseInt(depositAmount);
  const withdrawAmount = `${faker.number.int({ min: 50, max: 500 })}`;
  const balanceAfterWithdraw = balanceAfterDeposit - withdrawAmount;
  const user = 'Hermoine Granger';
  const accountNumber = '1001';

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
      .contains('strong', initialBalance)
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

    cy.get('[ng-class="btnClass1"]').click();
    cy.get('tr > :nth-child(1)').should('be.visible');
    cy.get('a[ng-click*="sortType = \'date\'"]').click();
    cy.get('[ng-click="back()"]').click();

    cy.get('[name="accountSelect"]').select('1002');

    cy.get('[ng-class="btnClass1"]').click();
    cy.get('.table').should('not.contain.text', 'Deposit')
      .and('not.contain.text', 'Withdraw');

    cy.contains('.btn', 'Home').click();
    cy.get('.btn').contains('Customer Login').should('be.visible');
  });
});
