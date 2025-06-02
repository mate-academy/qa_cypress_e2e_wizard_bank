/// <reference types='cypress' />

import { faker } from '@faker-js/faker';

describe('Bank app', () => {
  const user = 'Hermoine Granger';
  const accountNumber = '1001';
  let balance = 5096;
  const currency = 'Dollar';
  const depositAmount = faker.number.int({ min: 500, max: 1000 });
  const withdrawAmount = faker.number.int({ min: 500, max: 1000 });

  before(() => {
    cy.visit('/');
  });

  it(`should provide the ability to work with Hermione's bank account`, () => {
    cy.contains('button', 'Customer Login').click();

    cy.get('[name="userSelect"]').select(user);
    cy.contains('button', 'Login').click();

    cy.contains('[ng-hide="noAccount"]', 'Account Number : ')
      .contains('strong', accountNumber)
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', ', Balance : ')
      .contains('strong', balance)
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', ' , Currency : ')
      .contains('strong', currency)
      .should('be.visible');

    // Deposit
    cy.get('[ng-click="deposit()"]').click();
    cy.contains('label', 'Amount to be Deposited :').should('be.visible');
    cy.get('input[ng-model="amount"]').type(depositAmount);
    cy.contains('button[class="btn btn-default"]', 'Deposit').click();
    cy.contains('span', 'Deposit Successful').should('be.visible');

    balance += depositAmount;

    cy.contains('[ng-hide="noAccount"]', ', Balance : ')
      .contains('strong', balance)
      .should('be.visible');

    // Withdraw
    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('label', 'Amount to be Withdrawn :').should('be.visible');
    cy.get('input[ng-model="amount"]').type(withdrawAmount);
    cy.contains('button[class="btn btn-default"]', 'Withdraw').click();
    cy.contains('span', 'Transaction successful').should('be.visible');

    balance -= withdrawAmount;

    cy.contains('[ng-hide="noAccount"]', ', Balance : ')
      .contains('strong', balance)
      .should('be.visible');

    // Transitions
    cy.get('[ng-click="transactions()"]').click();
    cy.get('table').should('be.visible');
    cy.get('td.ng-binding').should('contain', withdrawAmount);
    cy.get('td.ng-binding').should('contain', depositAmount);

    cy.get('.logout').click();
    cy.url().should('include', '/customer');
  });
});
