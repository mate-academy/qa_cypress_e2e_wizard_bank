/// <reference types='cypress' />

const moment = require('moment');

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (accountInfo) => {
  const { user } = accountInfo;

  cy.contains('button', 'Customer Login').click();
  cy.get('select').select(user);
  cy.contains('button', 'Login').click();
});

Cypress.Commands.add('assertAccountInfo', (accountInfo) => {
  const {
    accountNumber,
    currentBalance,
    currency
  } = accountInfo;

  cy.contains('[ng-hide="noAccount"]', 'Account Number')
    .contains('.ng-binding', accountNumber[0])
    .should('be.visible');
  cy.contains('[ng-hide="noAccount"]', 'Balance')
    .contains('.ng-binding', currentBalance)
    .should('be.visible');
  cy.contains('[ng-hide="noAccount"]', 'Currency')
    .contains('.ng-binding', currency)
    .should('be.visible');
});

Cypress.Commands.add('transactionOperations', (accountInfo) => {
  const {
    depositAmount,
    withdrawAmount,
    balanceAfterDeposit,
    balanceAfterWithdrow
  } = accountInfo;

  // deposit operation:
  cy.get('[ng-click="deposit()"]').click();
  cy.contains('label', 'Amount to be Deposited')
    .should('be.visible');
  cy.get('[placeholder="amount"]').type(depositAmount);
  cy.contains('[type="submit"]', 'Deposit').click();

  const depositTime = moment().add(1, 's').format('MMM D, YYYY h:mm:ss A');

  cy.get('[ng-show="message"]')
    .should('contain.text', 'Deposit Successful');
  cy.contains('[ng-hide="noAccount"]', 'Balance')
    .contains('.ng-binding', balanceAfterDeposit)
    .should('be.visible');

  // withdraw operation:
  cy.get('[ng-click="withdrawl()"]').click();
  cy.contains('label', 'Amount to be Withdrawn')
    .should('be.visible');
  cy.get('[placeholder="amount"]').type(withdrawAmount);
  cy.contains('[type="submit"]', 'Withdraw').click();

  const withdrawTime = moment().add(1, 's').format('MMM D, YYYY h:mm:ss A');

  cy.get('[ng-show="message"]')
    .should('contain.text', 'Transaction successful');
  cy.contains('[ng-hide="noAccount"]', 'Balance')
    .contains('.ng-binding', balanceAfterWithdrow)
    .should('be.visible');

  cy.wrap({ depositTime, withdrawTime });
});

Cypress.Commands.add('transactionDetails', (
  accountInfo,
  depositTime,
  withdrawTime
) => {
  const {
    date,
    depositAmount,
    withdrawAmount
  } = accountInfo;

  cy.get('[ng-click="transactions()"]').click();
  cy.get('[ng-model="startDate"]').type(date);
  cy.get('table', { timeout: 2000 }).should('exist');
  cy.get('table tbody').should('not.be.empty');
  cy.get('table tbody').should('contain', depositTime);
  cy.get('table tbody').should('contain', depositAmount)
    .and('be.visible');
  cy.get('table tbody').should('contain', withdrawTime);
  cy.get('table tbody').should('contain', withdrawAmount)
    .and('be.visible');
});

Cypress.Commands.add('noTransactionAccount', (accountInfo) => {
  const {
    accountNumber,
    depositAmount,
    withdrawAmount
  } = accountInfo;

  cy.get('select').select(accountNumber[1]);
  cy.get('[ng-click="transactions()"]').click();
  cy.get('table').should('exist');
  cy.get('table tbody')
    .should('not.contain', depositAmount)
    .should('not.contain', withdrawAmount);
});
