import { faker } from '@faker-js/faker';
/// <reference types='cypress' />

describe('GlobalsQa Bank App - Hermione Granger', () => {
  const depositAmount = `${faker.number.int({ min: 500, max: 1000 })}`;
  const withdrawAmount = `${faker.number.int({ min: 50, max: 500 })}`;
  const user = 'Hermoine Granger';
  const accountNumber = '1001';

  before(() => {
    cy.visit('/');
  });

  it('should handle full flow from login to transactions', () => {
    // Step 1: Customer Login
    cy.contains('.btn', 'Customer Login').click();

    // Step 2: Select Hermione Granger from the dropdown
    cy.get('[name="userSelect"]').select(user);

    // Step 3: Click Login
    cy.contains('.btn', 'Login').click();

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', accountNumber)
      .should('be.visible');

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', '0')
      .should('be.visible');

    cy.contains('.ng-binding', 'Dollar')
      .should('be.visible');

    cy.get('[ng-click="deposit()"]').click();

    cy.get('[placeholder="amount"]').type(depositAmount);

    cy.contains('[type="submit"]', 'Deposit').click();

    cy.get('[ng-show="message"]')
      .should('contain', 'Deposit Successful');

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .should('be.visible');

    cy.get('[ng-click="withdrawl()"]').click();

    cy.get('[placeholder="amount"]').type(withdrawAmount);

    cy.contains('[type="submit"]', 'Withdraw').click();

    cy.get('[ng-click="transactions()"]').click();

    cy.get('table')
      .should('contain', 'Transaction Type');

    cy.get('[ng-click="back()"]').click();

    cy.get('[name="accountSelect"]').select('1002'); // Assuming the next account is '1002'

    cy.get('[ng-click="transactions()"]').click();

    cy.get('table')
      .should('not.contain', 'Deposit')
      .and('not.contain', 'Withdraw');

    cy.get('[ng-click="back()"]').click();
    cy.get('[ng-click="byebye()"]').click();
  });
});
