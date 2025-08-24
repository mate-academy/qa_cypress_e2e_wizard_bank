/* eslint-disable quotes */
/// <reference types="cypress" />

describe('Bank app', () => {
  before(() => {
    cy.visit(
      'https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login'
    );
  });

  it("should provide the ability to work with Hermione's bank account", () => {
    // login
    cy.contains('.btn', 'Customer Login').click();
    cy.get('#userSelect').select('Hermoine Granger');
    cy.contains('.btn', 'Login').click();

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', '1001')
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', '0')
      .should('be.visible');
    cy.contains('.ng-binding', 'Dollar').should('be.visible');

    cy.get('[ng-click="transactions()"]').click();
    cy.get('table tbody tr').should('have.length', 0);
    cy.get('[ng-click="back()"]').click();

    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type('500');
    cy.contains('[type="submit"]', 'Deposit').click();
    cy.get('[ng-show="message"]').should('contain', 'Deposit Successful');

    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw').should('be.visible');
    cy.get('[placeholder="amount"]').type('400');
    cy.contains('[type="submit"]', 'Withdraw').click();
    cy.get('[ng-show="message"]').should('contain', 'Transaction successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', '100')
      .should('be.visible');

    cy.get('[ng-click="transactions()"]').click();
    cy.get('table tbody tr').should('have.length', 2);

    cy.get('table tbody tr')
      .contains('Credit')
      .parent()
      .should('contain', '500');
    cy.get('table tbody tr')
      .contains('Debit')
      .parent()
      .should('contain', '400');

    cy.get('[ng-click="back()"]').click();

    cy.get('#accountSelect').select('1002');
    cy.get('[ng-click="transactions()"]').click();
    cy.get('table tbody tr').should('have.length', 0);
    cy.get('[ng-click="back()"]').click();

    cy.get('.logout').click();
    cy.contains('Customer Login').should('be.visible');
    cy.url().should('include', '/customer');
  });
});
