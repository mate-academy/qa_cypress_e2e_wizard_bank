/// <reference types='cypress' />

import {
  faker
} from '@faker-js/faker';

describe('Bank app', () => {
  const amountDeposit = faker.number.int({
    min: 50,
    max: 500
  });
  const balance = 5096;
  const balanceAfterDeposit = balance + amountDeposit;
  const withdrawl = faker.number.int({
    min: 1,
    max: amountDeposit
  });
  const balanceAfterWithdraw = balanceAfterDeposit - withdrawl;

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('.btn', 'Customer Login')
      .click();
    cy.get('#userSelect')
      .select('Hermoine Granger');
    cy.contains('.btn', 'Login')
      .click();
    cy.contains('div', 'Account Number')
      .contains('strong', '1001')
      .should('be.visible');
    cy.contains('div', 'Balance')
      .contains('strong', balance)
      .should('be.visible');
    cy.contains('div', 'Currency')
      .contains('strong', 'Dollar')
      .should('be.visible');
    cy.contains('button', 'Deposit')
      .click();
    cy.get('[placeholder="amount"]')
      .type(amountDeposit);
    cy.get('[type="submit"]')
      .contains('Deposit')
      .click();
    cy.contains('span', 'Deposit Successful');
    cy.contains('div', 'Balance')
      .contains('strong', balanceAfterDeposit)
      .should('be.visible');
    cy.contains('button', 'Withdrawl')
      .click();
    cy.get('[type="submit"]')
      .contains('Withdraw')
      .should('be.visible');
    cy.get('[placeholder="amount"]')
      .type(withdrawl);
    cy.get('[type="submit"]')
      .contains('Withdraw')
      .click();
    cy.contains('span', 'Transaction successful')
      .should('be.visible');
    cy.contains('div', 'Balance')
      .contains('strong', balanceAfterWithdraw)
      .should('be.visible');
    cy.contains('button', 'Transactions')
      .should('be.visible');
    cy.contains('button', 'Transactions')
      .click();
    cy.get('#start').clear();
    cy.get('#start').type('2025-11-08T00:01');
    cy.get('[id*="anchor"]').should('be.visible');
    cy.get('[ng-repeat*="tx in transactions"]')
      .last().find('td').should('contain', withdrawl);
    cy.get('[ng-repeat*="tx in transactions"]')
      .eq('-2').find('td').should('contain', amountDeposit);
    cy.contains('button', 'Back')
      .click();
    cy.get('[id="accountSelect"]')
      .select('1002');
    cy.contains('button', 'Transactions')
      .should('be.visible');
    cy.contains('button', 'Transactions')
      .click();
    cy.get('.table').should('not.contain', 'Debit');
    cy.get('.table').should('not.contain', 'Credit');
    cy.contains('button', 'Back')
      .click();
    cy.contains('button', 'Logout').should('be.visible');
    cy.contains('button', 'Logout')
      .click();
    cy.contains('div', 'Your Name')
      .should('be.visible');
  });
});
