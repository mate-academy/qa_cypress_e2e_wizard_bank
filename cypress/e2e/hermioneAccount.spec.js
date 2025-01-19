/// <reference types='cypress' />

import { faker } from '@faker-js/faker';

describe('Bank app', () => {
  const depositAmount = `${faker.number.int({ min: 500, max: 1000 })}`;
  const withdrawAmount = `${faker.number.int({ min: 50, max: 500 })}`;
  const balance = depositAmount - withdrawAmount;
  const user = 'Hermione Granger';
  const accountNumber = '1001';

  before(() => {
    cy.visit('/');
  });

  it(`should provide the ability to work with Hermione/'s bank account`, () => {
    // Login as Hermione Granger
    cy.contains('.btn', 'Customer Login').click();
    cy.get('[name="userSelect"]').select(user);
    cy.contains('.btn', 'Login').click();

    // Assert Account Number
    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', accountNumber)
      .should('be.visible');

    // Assert Balance and Currency
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', '0')
      .should('be.visible');
    cy.contains('.ng-binding', 'Dollar')
      .should('be.visible');

    // Deposit Money
    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type(depositAmount);
    cy.contains('[type="submit"]', 'Deposit').click();

    // Assert Success Message and Balance
    cy.get('[ng-show="message"]')
      .should('contain', 'Deposit Successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', depositAmount)
      .should('be.visible');

    // Withdraw Money
    cy.get('[ng-click="withdrawl()"]').click();
    cy.get('[placeholder="amount"]').type(withdrawAmount);
    cy.contains('[type="submit"]', 'Withdraw').click();

    // Assert Success Message and Balance
    cy.get('[ng-show="message"]')
      .should('contain', 'Transaction successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balance)
      .should('be.visible');

    // Check Transactions
    cy.get('[ng-click="transactions()"]').click();
    cy.get('table').within(() => {
      cy.contains('td', depositAmount).should('be.visible');
      cy.contains('td', withdrawAmount).should('be.visible');
    });

    // Back to Account Page
    cy.get('[ng-click="back()"]').click();

    // Change Account and Assert No Transactions
    cy.get('[id="accountSelect"]').select(1); // Selecting a different account
    cy.get('[ng-click="transactions()"]').click();
    cy.get('table').within(() => {
      cy.get('td').should('not.exist');
    });

    // Logout
    cy.get('[ng-click="byebye()"]').click();

    // Assert Logged Out
    cy.contains('.btn', 'Customer Login').should('be.visible');
  });
});
