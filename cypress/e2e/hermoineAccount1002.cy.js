/* eslint-disable cypress/no-assigning-return-values */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import { faker } from '@faker-js/faker';
/// <reference types='cypress' />

describe('Bank app', () => {
  const depositAmount = `${faker.number.int({ min: 500, max: 1000 })}`;
  const withdrawAmount = `${faker.number.int({ min: 50, max: 500 })}`;

  const user = 'Hermoine Granger';
  const accountNumber = ['1001', '1002', '1003'];
  before(() => {
    cy.visit('/');
    // const currentDate = new Date();
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.title().should('eq', 'XYZ Bank');
    cy.assertPageUrl('#/login');
    cy.contains('.btn', 'Customer Login').click();
    cy.get('select[name="userSelect"]').select(user);
    cy.contains('.btn', 'Login').click();
    cy.assertPageUrl('#/account');
    cy.get('#accountSelect').select(accountNumber[1]);
    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong.ng-binding', accountNumber[1])
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Currency')
      .contains('strong.ng-binding', 'Pound')
      .should('be.visible');

    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type(depositAmount);
    cy.contains('[type="submit"]', 'Deposit').click();

    cy.get('[ng-click="withdrawl()"]').click();
    cy.get('[placeholder="amount"]').type(withdrawAmount);
    cy.contains('[type="submit"]', 'Withdraw').click();

    cy.get('[ng-class="btnClass1"]')
      .should('include.text', 'Transactions')
      .click();
    cy.get('button').contains('Reset').click();
    cy.get('button').contains('Back').click();

    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type(depositAmount);
    cy.contains('[type="submit"]', 'Deposit').click();

    cy.get('[ng-click="withdrawl()"]').click();
    cy.get('[placeholder="amount"]').type(withdrawAmount);
    cy.contains('[type="submit"]', 'Withdraw').click();

    cy.get('[ng-class="btnClass1"]')
      .should('include.text', 'Transactions')
      .click();
    cy.get('button').contains('Back').click();
    cy.get('[ng-class="btnClass1"]')
      .should('include.text', 'Transactions')
      .click();

    cy.get('table.table.table-bordered.table-striped tr')
      .should('have.length', 3)
      .then(($rows) => {
        cy.get('table.table.table-bordered.table-striped')
          .find('tr')
          .eq($rows.length - 1)
          .should('contain', 'Debit')
          .should('contain', depositAmount);
        cy.get('table.table.table-bordered.table-striped')
          .find('tr')
          .eq($rows.length - 2)
          .should('contain', 'Credit')
          .should('contain', withdrawAmount);
      });

    cy.get('.logout').click();
    cy.assertPageUrl('#/customer');
  });
});
