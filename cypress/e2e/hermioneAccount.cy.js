/// <reference types='cypress' />

import { faker } from '@faker-js/faker';

describe('Bank app', () => {
  const depositAmount = `${faker.number.int({ min: 500, max: 1000 })}`;
  const withdrawAmount = `${faker.number.int({ min: 50, max: 500 })}`;
  const user = 'Hermoine Granger';
  const accountNumber = '1001';
  let balance = 5096;
  const date = new Date();
  const formatDate = date.toISOString().slice(0, 14);
  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('.btn', 'Customer Login').click();

    cy.get('[name="userSelect"]').select(user);
    cy.contains('.btn', 'Login').click();

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', accountNumber);

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', '5096')
      .should('be.visible');
    cy.contains('.ng-binding', 'Dollar')
      .should('be.visible');

    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type(depositAmount);
    cy.contains('[type="submit"]', 'Deposit').click();

    cy.get('[ng-show="message"]')
      .should('contain', 'Deposit Successful');
    balance = +depositAmount + balance;
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balance)
      .should('be.visible');

    balance = balance - (+withdrawAmount);

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

    cy.get('#start').click();
    cy.get('#start').type(`${formatDate}00:00`);

    cy.get('#anchor0 > :nth-child(2)').should('contain', `${depositAmount}`);
    cy.get('#anchor1 > :nth-child(2)').should('contain', `${withdrawAmount}`);

    cy.get('[ng-click="back()"]').click();

    cy.get('.logout').click();
    cy.get('[name="userSelect"]').select('Ron Weasly');
    cy.contains('.btn', 'Login').click();
    cy.get('[ng-click="transactions()"]').click();
    cy.get('#anchor0').should('not.exist');
    cy.get('.logout').click();
    cy.url().should('contain', '/customer');
  });
});
