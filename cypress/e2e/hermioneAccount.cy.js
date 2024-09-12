/// <reference types='cypress' />

import { data } from '../support/data.js';

describe('Bank app', () => {
  before(() => {
    cy.visit('/');
  });

  it("should provide the ability to work with Hermione's bank account", () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('[name="userSelect"]').select(data.user);
    cy.contains('.btn', 'Login').click();

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', data.accountNumber)
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', data.balance)
      .should('be.visible');
    cy.contains('.ng-binding', data.currency).should('be.visible');

    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type(data.depositValue);
    cy.contains('[type="submit"]', 'Deposit').click();

    cy.get('[ng-show="message"]').should('contain', 'Deposit Successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance').should('be.visible');

    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw').should('be.visible');
    cy.get('[placeholder="amount"]').type(data.withdrawlValue);
    cy.contains('[type="submit"]', 'Withdraw').click();

    cy.get('[ng-show="message"]').should('contain', 'Transaction successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', data.balance)
      .should('be.visible');

    cy.wait(500);

    cy.get('[ng-click="transactions()"]').click();
    cy.get('td:nth-child(3)').eq(-2).should('contain', 'Credit');
    cy.get('td:nth-child(3)').last().should('contain', 'Debit');

    cy.get('[ng-click="back()"]').click();
    cy.get('[id="accountSelect"]').select('1002');

    cy.get('[ng-click="transactions()"]').click();
    cy.get('tr#anchor1').should('not.exist');

    cy.get('[ng-click="byebye()"]').click();
    cy.get('#userSelect').should('exist');
  });
});
