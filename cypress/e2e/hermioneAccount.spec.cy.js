import { faker } from '@faker-js/faker';
/// <reference types='cypress' />

describe('Bank app', () => {
  const balance = 5096;
  const depositAmount = 500;
  const withdrawAmount = 300;
  const depositSum = balance + depositAmount;
  const balanceNew = depositSum - withdrawAmount;
  const user = 'Hermoine Granger';
  const accountNumber = '1001';

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('[name="userSelect"]').select(user);
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
    cy.get('[ng-show="message"]').should('contain', 'Deposit Successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', depositSum.toString())
      .should('be.visible');

    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw')
      .should('be.visible');
    cy.get('[placeholder="amount"]').type(withdrawAmount);
    cy.contains('[type="submit"]', 'Withdraw').click();
    cy.get('[ng-show="message"]')
      .should('contain', 'Transaction successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balanceNew.toString())
      .should('be.visible');

    cy.get('[ng-click="transactions()"]').click();
    cy.get('#start').type('2024-07-30T00:00:00');
    cy.get('tr#anchor0.ng-scope').contains(depositAmount.toString())
.should('be.visible');
    cy.get('tr#anchor1.ng-scope').contains(withdrawAmount.toString())
.should('be.visible');

    cy.get('[ng-click="back()"]').click();
    cy.get('[ng-change="selectAcct()"]').select('1002');

    cy.get('[ng-click="transactions()"]').click();
    cy.get('tr#anchor0.ng-scope').should('not.exist');
    cy.get('[ng-click="byebye()"]').click();
    cy.get('#userSelect').should('exist');
  });
});
