/// <reference types='cypress' />

import { faker } from '@faker-js/faker';

describe('Bank app', () => {
  const depositAmount = faker.number.int({ min: 100, max: 1000 });
  const withdrawAmount = faker.number.int({ min: 50, max: 500 });
  let balance = 5096;
  const user = 'Hermione Granger';
  const accountNumber = '1001';

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('#userSelect').select(user);
    cy.contains('.btn', 'Login').click();

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', accountNumber)
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balance)
      .should('be.visible');
    cy.contains('.ng-binding', 'Dollar')
      .should('be.visible');

    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type(depositAmount);
    cy.contains('[type="submit"]', 'Deposit').click();

    balance += depositAmount;

    cy.get('[ng-show="message"]')
      .should('contain', 'Deposit Successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balance)
      .should('be.visible');

    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw')
      .should('be.visible');
    cy.get('[placeholder="amount"]').type(withdrawAmount);
    cy.contains('[type="submit"]', 'Withdraw').click();

    balance -= withdrawAmount;

    cy.get('[ng-show="message"]')
      .should('contain', 'Transaction successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balance)
      .should('be.visible');

    cy.get('[ng-click="transactions()"]').click();
    // eslint-disable-next-line cypress/no-force
    cy.contains('a', 'Date-Time').click({ force: true });
    cy.get('#anchor0')
      .should('contain', 'Debit')
      .should('contain', withdrawAmount);
    cy.get('#anchor1')
      .should('contain', 'Credit')
      .should('contain', depositAmount);

    cy.get('[ng-click="back()"]').click();
    cy.get('#accountSelect').select('1002');
    cy.get('[ng-click="transactions()"]').click();
    cy.get('#anchor0').should('not.exist');
    cy.get('#anchor1').should('not.exist');

    cy.get('[ng-click="byebye()"]').click();
    cy.get('[ng-click="transactions()"]').should('not.exist');
    cy.url().should('include', '#/customer');
    cy.get('[name="userSelect"]').should('be.visible');
    cy.contains('label', 'Your Name').should('be.visible');
  });
});
