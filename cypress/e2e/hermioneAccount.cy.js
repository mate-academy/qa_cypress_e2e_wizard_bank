/// <reference types='cypress' />

import { faker } from '@faker-js/faker';

describe('Bank app', () => {
  const userValue = '1';
  const accountNumber = '1001';
  const startBalance = 5096;

  const depositAmount = faker.number.int({ min: 1000, max: 5000 });
  const withdrawAmount = faker.number.int({ min: 100, max: 500 });
  const balance = depositAmount - withdrawAmount + startBalance;

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('.btn', 'Customer Login').click();

    cy.get('[name="userSelect"]').select(userValue);

    cy.contains('.btn', 'Login').click();

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', accountNumber)
      .should('be.visible');

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', '5096')
      .should('be.visible');

    cy.contains('.ng-binding', 'Dollar')
      .should('be.visible');

    cy.get('[ng-click="deposit()"]').click();

    cy.get('[ng-model="amount"]').type(depositAmount);

    cy.contains('[type="submit"]', 'Deposit').click();

    cy.get('[ng-show="message"]')
      .should('contain', 'Deposit Successful');

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', depositAmount + startBalance)
      .should('be.visible');

    cy.get('[ng-click="withdrawl()"]').click();

    cy.contains('[type="submit"]', 'Withdraw')
      .should('be.visible');
    cy.get('[placeholder="amount"]').type(withdrawAmount);

    cy.contains('[type="submit"]', 'Withdraw').click();

    cy.get('[ng-show="message"]')
      .should('contain', 'Transaction successful');

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balance)
      .should('be.visible');

    cy.get('[ng-click="transactions()"]').click();

    cy.get('td').should('contain.text', 'Credit');
    cy.get('td').should('contain.text', 'Debit');

    cy.get('[ng-click="reset()"]').click();

    cy.get('[ng-click="back()"]').click();

    cy.get('[name="accountSelect"]').select(2);

    cy.get('[ng-click="transactions()"]').click();

    cy.get('tbody').should('not.contain', 'td');

    cy.get('[ng-show="logout"]').click();

    cy.get('[name="userSelect"]').should('contain.text', '---Your Name---');
  });
});
