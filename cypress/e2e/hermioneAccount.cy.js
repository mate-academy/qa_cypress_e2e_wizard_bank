/// <reference types='cypress' />
// import { faker } from '@faker-js/faker';

describe('Bank app', () => {
  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('button', 'Customer Login').click();
    cy.get('#userSelect').select('Hermoine Granger');
    cy.contains('button', 'Login').click();

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', '1001')
      .should('be.visible');

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', '5096')
      .should('be.visible');

    cy.contains('.ng-binding', 'Dollar')
      .should('be.visible');

    cy.get('[ng-click="deposit()"]').click();
    cy.contains('Amount to be Deposited').should('be.visible');

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', '5096')
      .should('be.visible');

    cy.contains('button', 'Withdrawl').click();
    cy.contains('[type="submit"]', 'Withdraw')
      .should('be.visible');
    cy.get('[placeholder="amount"]').type('1000');
    cy.contains('[type="submit"]', 'Withdraw').click();

    cy.contains('Transaction successful').should('be.visible');

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', '4096')
      .should('be.visible');

    cy.contains('button', 'Transactions').click();
    cy.contains('button', 'Back').click();

    cy.get('#accountSelect')
      .select('1002');

    cy.contains('button', 'Transactions').click();

    cy.get('#anchor tbody tr')
      .should('have.length', 0);
    cy.get('.logout').click();

    cy.get('label').contains('Your Name :').should('be.visible');
  });
});
