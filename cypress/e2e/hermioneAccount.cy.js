import { faker } from '@faker-js/faker';
import { utils } from '../support/utils.js';
/// <reference types='cypress' />

describe('Bank app', () => {
  const user = 'Hermoine Granger';
  const accountNumberPrimary = '1001';
  const accountNumberSecondary = '1002';
  const initialBalance = '5096';
  const depositAmount = `${faker.number.int({ min: 500, max: 1000 })}`;
  const withdrawAmount = `${faker.number.int({ min: 50, max: 500 })}`;
  const balanceAfterDeposit =
    (Number(initialBalance) + Number(depositAmount)).toString();
  const balanceAfterWithdraw =
    (Number(balanceAfterDeposit) - Number(withdrawAmount)).toString();

  // const balance = depositAmount - withdrawAmount;

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('[name="userSelect"]').select(user);
    cy.contains('.btn', 'Login').click();

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', accountNumberPrimary)
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

    cy.get('[ng-click="transactions()"]').click();
    cy.get('#start').click();
    cy.get('#start').type(utils.formatCurrentDate());

    cy.get('#anchor0').should('be.visible');
    cy.get('#anchor1').should('be.visible');

    cy.get('#anchor0')
      .should('contain.text', 'Credit');
    cy.get('#anchor0')
      .should('contain.text', depositAmount);
    cy.get('#anchor1')
      .should('contain.text', 'Debit');
    cy.get('#anchor1')
      .should('contain.text', withdrawAmount);

    cy.get('[ng-click="back()"]').click();
    cy.get('#accountSelect').select(accountNumberSecondary);

    cy.get('[ng-click="transactions()"]').click();

    cy.get('#anchor0')
      .should('not.exist');
    cy.get('#anchor1')
      .should('not.exist');

    cy.contains('tr', 'Credit').should('not.exist');
    cy.contains('tr', 'Debit').should('not.exist');

    cy.get('[ng-show="logout"]').click();
    cy.url().should('include', '/customer');
  });
});
