/// <reference types='cypress' />

import { faker } from '@faker-js/faker';

describe('Bank App – Customer Operations', () => {
  const customerName = 'Hermoine Granger';
  const accountNumber = '1001';
  const currency = 'Dollar';
  const initialBalance = 5096;

  const depositAmount = faker.number.int({ min: 100, max: 2000 });
  const withdrawAmount = faker.number.int({ min: 50, max: depositAmount });

  before(() => {
    cy.visit('/');
  });

  it(`should allow ${customerName} to log in and perform transactions`, () => {
    cy.contains('button', 'Customer Login').click();
    cy.get('#userSelect').select(customerName);
    cy.get('.btn-default').should('be.visible').click();

    cy.contains('.center', 'Account Number').should(
      'contain.text',
      accountNumber
    );
    cy.contains('.center', 'Balance').should('contain.text', initialBalance);
    cy.contains('.center', 'Currency').should('contain.text', currency);

    cy.get('[ng-class="btnClass2"]').click();
    cy.get('.form-control').type(depositAmount.toString());
    cy.get('[type="submit"]').click();
    cy.contains('[ng-show="message"]', 'Deposit Successful').should(
      'be.visible'
    );

    const balanceAfterDeposit = initialBalance + depositAmount;
    cy.contains('.center', 'Balance').should(
      'contain.text',
      balanceAfterDeposit
    );

    cy.get('[ng-class="btnClass3"]').click();
    cy.contains('[type="submit"]', 'Withdraw').should('be.visible');
    cy.get('[placeholder="amount"]').type(withdrawAmount.toString());
    cy.contains('[type="submit"]', 'Withdraw').click();
    cy.contains('[ng-show="message"]', 'Transaction successful').should(
      'be.visible'
    );

    const balanceAfterWithdrawal = balanceAfterDeposit - withdrawAmount;
    cy.contains('.center', 'Balance').should(
      'contain.text',
      balanceAfterWithdrawal
    );

    cy.reload();
    cy.get('[ng-click="transactions()"]').click();

    cy.get('td.ng-binding').should('contain', depositAmount);
    cy.get('td.ng-binding').should('contain', withdrawAmount);

    cy.get('[ng-click="back()"]').click();

    cy.get('.logout').click();
    cy.url().should('include', '/customer');
  });
});
