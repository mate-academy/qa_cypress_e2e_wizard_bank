/// <reference types='cypress' />

const { faker } = require('@faker-js/faker');
const { toLocalISOString } = require('../support/toLocalISOString');

describe('Bank app', () => {
  before(() => {
    cy.visit('/login');
  });

  it(`should provide the ability to work with Hermione's bank account`, () => {
    const user = 'Hermoine Granger';

    const balance = 5096;
    const currency = 'Dollar';
    const accountNumber = '1001';

    const depositAmount = faker.number.int({ min: 500, max: 700 });
    const withdrawAmount = faker.number.int({ min: 50, max: 500 });

    cy.contains('.btn', 'Customer Login').click();
    cy.get('[name="userSelect"]').select(user);
    cy.contains('.btn', 'Login').click();

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .should('be.visible')
      .contains('strong', accountNumber);

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .should('be.visible')
      .contains('strong', `${balance}`);

    cy.contains('[ng-hide="noAccount"]', 'Currency')
      .should('be.visible')
      .contains('strong', currency);

    const startTime = toLocalISOString();

    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type(depositAmount.toString());

    cy.contains('[type="submit"]', 'Deposit').click();
    cy.get('[ng-show="message"]').should('contain', 'Deposit Successful');

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balance + depositAmount)
      .should('be.visible');

    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw').should('be.visible');

    cy.get('[placeholder="amount"]').type(withdrawAmount);
    cy.contains('[type="submit"]', 'Withdraw').should('exist').click();

    cy.get('[ng-show="message"]').should('contain', 'Transaction successful');

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balance + depositAmount - withdrawAmount)
      .should('be.visible');

    cy.contains('button', 'Transactions').should('exist').click();

    cy.get('[ng-show="showDate"] input[name="start"]')
      .should('exist')
      .type(`${startTime}`);

    cy.get('table tbody tr')
      .eq(0)
      .within(() => {
        cy.get('td').eq(1).should('contain', `${depositAmount}`);
        cy.get('td').eq(2).should('contain', 'Credit');
      });

    cy.get('table tbody tr')
      .eq(1)
      .within(() => {
        cy.get('td').eq(1).should('contain', `${withdrawAmount}`);
        cy.get('td').eq(2).should('contain', 'Debit');
      });

    cy.contains('button', 'Back').should('exist').click();

    cy.get('select[ng-hide="noAccount"]').select(1);
    cy.contains('button', 'Transactions').should('exist').click();

    cy.get('table tbody tr').should('not.exist');
    cy.contains('button', 'Logout').should('exist').click();

    cy.get('[name="userSelect"]').should('exist');
  });
});
