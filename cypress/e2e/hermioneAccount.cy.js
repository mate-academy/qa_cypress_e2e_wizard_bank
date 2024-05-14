/* eslint-disable max-len */
/// <reference types='cypress' />

const { visitFunctionBody } = require("typescript");

describe('Bank app', () => {
  const user = 'Hermoine Granger';
  const accountNumber = '1001';
  const currency = 'Dollar';
  const balance = '5096';

  const depositAmount = 100;
  const withdrawlAmount = 200;

  const balanceDeposit = +balance + depositAmount;

  beforeEach(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('#userSelect').select(user);
    cy.contains('.btn', 'Login').click();

    cy.contains('.center', 'Account Number')
      .contains('strong', accountNumber)
      .should('be.visible');
    cy.contains('.center', 'Balance')
      .contains('strong', balance)
      .should('be.visible');
    cy.contains('.center', 'Currency')
      .contains('strong', currency)
      .should('be.visible');

    cy.contains('.center', 'Deposit').click();
    cy.findByPlaceholder('amount').type(depositAmount);
    cy.get('[type="submit"], Deposit').click();

    cy.get('[ng-show="message"]')
      .should('contain', 'Deposit Successful');
    cy.contains('.center', 'Balance')
      .contains('strong', balanceDeposit)
      .should('be.visible');

    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw')
      .should('be.visible');
    cy.get('[placeholder="amount"]').type(withdrawlAmount);
    cy.contains('[type="submit"]', 'Withdraw').click();

    cy.get('[ng-show="message"]')
      .should('contain', 'Transaction successful');
    cy.contains('.center', 'Balance')
      .contains('strong', balanceDeposit - withdrawlAmount)
      .should('be.visible');

    cy.get('[ng-click="transactions()"]').click();
    // Transaction table isn't displayed usually so tests cannot be run
    cy.get('[ng-click="back()"]').click();

    cy.get('#accountSelect').select('1002');
    cy.get('[ng-click="byebye()"]').click();
    cy.get('label').should('contain', 'Your Name :');
  });
});
