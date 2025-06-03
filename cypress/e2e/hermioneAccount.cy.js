/* eslint-disable */
/// <reference types='cypress' />

import { faker } from '@faker-js/faker';

describe("Bank app - Hermione's account", () => {
  const depositAmount = faker.number.int({ min: 500, max: 1000 });
  const withdrawAmount = faker.number.int({ min: 50, max: depositAmount / 2 });
  const balanceAfterDeposit = depositAmount;
  const balanceAfterWithdraw = depositAmount - withdrawAmount;
  const user = 'Hermione Granger';
  const accountNumber = '1001'; // Example account number

  before(() => {
    cy.visit('/');
  });

  it("should complete Hermione's bank transactions successfully", () => {
    // 🔹 Login Flow
    cy.contains('Customer Login').click();
    cy.get('[name="userSelect"]').select(user);
    cy.contains('Login').click();

    // 🔹 Assertions: Account Information
    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', accountNumber)
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', '0')
      .should('be.visible');
    cy.contains('.ng-binding', 'Dollar').should('be.visible');

    // 🔹 Deposit Flow
    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type(depositAmount);
    cy.contains('Deposit').click();

    // 🔹 Assertions: Deposit Success
    cy.get('[ng-show="message"]').should('contain', 'Deposit Successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balanceAfterDeposit)
      .should('be.visible');

    // 🔹 Withdrawal Flow
    cy.get('[ng-click="withdrawl()"]').click();
    cy.get('[placeholder="amount"]').type(withdrawAmount);
    cy.contains('Withdraw').click();

    // 🔹 Assertions: Withdrawal Success
    cy.get('[ng-show="message"]').should('contain', 'Transaction successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balanceAfterWithdraw)
      .should('be.visible');

    // 🔹 Transactions Verification
    cy.get('[ng-click="transactions()"]').click();
    cy.contains('Deposit').should('be.visible');
    cy.contains('Withdraw').should('be.visible');
    cy.get('[ng-click="back()"]').click();

    // 🔹 Account Switching & Empty Transactions Check
    cy.get('[ng-model="accountNumber"]').select('1003'); // Switch account
    cy.get('[ng-click="transactions()"]').click();
    cy.contains('No transactions found').should('be.visible');

    // 🔹 Logout Flow
    cy.contains('Logout').click();
    cy.contains('Customer Login').should('be.visible');
  });
});
