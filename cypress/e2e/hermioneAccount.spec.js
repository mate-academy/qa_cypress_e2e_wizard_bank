import { faker } from '@faker-js/faker';
/// <reference types='cypress' />

describe('Bank app - Hermione Granger', () => {
  const depositAmount = faker.number.int({ min: 500, max: 1000 });
  const withdrawAmount = faker.number.int({ min: 50, max: 500 });
  const balance = depositAmount - withdrawAmount;
  const user = 'Hermione Granger';
  const accountNumber = '1001';
  const alternateAccountNumber = '1002';
  const currency = 'Dollar';

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    // Click Customer Login
    cy.contains('.btn', 'Customer Login').click();

    // Select Hermione Granger and Login
    cy.get('[name="userSelect"]').select(user);
    cy.contains('.btn', 'Login').click();

    // Assert Account Number, Balance, and Currency
    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', accountNumber)
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', '0')
      .should('be.visible');
    cy.contains('.ng-binding', currency)
      .should('be.visible');

    // Deposit money
    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type(`${depositAmount}`);
    cy.contains('[type="submit"]', 'Deposit').click();

    // Assert deposit success and updated balance
    cy.get('[ng-show="message"]')
      .should('contain', 'Deposit Successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', `${depositAmount}`)
      .should('be.visible');

    // Withdraw money
    cy.get('[ng-click="withdrawl()"]').click();
    cy.get('[placeholder="amount"]').type(`${withdrawAmount}`);
    cy.contains('[type="submit"]', 'Withdraw').click();

    // Assert withdrawal success and updated balance
    cy.get('[ng-show="message"]')
      .should('contain', 'Transaction successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', `${balance}`)
      .should('be.visible');

    // Check transactions
    cy.get('[ng-click="transactions()"]').click();
    cy.get('table tbody tr').should('have.length.at.least', 2);
    cy.get('table tbody tr').eq(0).within(() => {
      cy.get('td').eq(1).should('contain', `${depositAmount}`);
      cy.get('td').eq(2).should('contain', 'Credit');
    });
    cy.get('table tbody tr').eq(1).within(() => {
      cy.get('td').eq(1).should('contain', `${withdrawAmount}`);
      cy.get('td').eq(2).should('contain', 'Debit');
    });

    // Go back
    cy.get('[ng-click="back()"]').click();

    // Change account number
    cy.get('[name="accountSelect"]').select(alternateAccountNumber);

    // Check transactions for alternate account (should be empty)
    cy.get('[ng-click="transactions()"]').click();
    cy.get('table tbody tr').should('have.length', 0);

    // Logout
    cy.get('[ng-click="byebye()"]').click();

    // Assert user is logged out (back to login page)
    cy.contains('.btn', 'Customer Login').should('be.visible');
    cy.get('[name="userSelect"]').should('be.visible');
  });
});
