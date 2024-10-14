/// <reference types='cypress' />
import { faker } from '@faker-js/faker';

describe('Bank app', () => {
  before(() => {
    cy.visit('/');
  });
  const balance = '5096';
  const generateDepositAmount = `${faker.number.int({ min: 100, max: 500 })}`;
  const generateWithdrawAmount = `${faker.number.int({ min: 100, max: 500 })}`;

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('Customer Login').click();

    cy.get('#userSelect').select('Hermoine Granger');
    cy.contains('Login').click();

    cy.get('#accountSelect').should('have.value', 'number:1001');

    cy.contains('[ng-hide="noAccount"]', 'Balance').contains(balance)
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Dollar').should('be.visible');

    cy.contains('Deposit').click();
    cy.get('[placeholder="amount"]').type(generateDepositAmount);
    cy.get('[type="submit"]').click();
    cy.get('.error').should('exist').and('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains(+balance + +generateDepositAmount).should('be.visible');

    cy.contains('Withdrawl').click();
    cy.contains('[type="submit"]', 'Withdraw').should('be.visible');
    cy.get('[placeholder="amount"]').type(generateWithdrawAmount);
    cy.contains('[type="submit"]', 'Withdraw').click();
    cy.get('.error').should('exist').and('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains(+balance + +generateDepositAmount - +generateWithdrawAmount)
      .should('be.visible');

    cy.contains('Transactions').click();
    cy.contains('Back').click();
    cy.contains('Transactions').click();
    cy.get('#start').type('2024-10-14T12:00:53');
    cy.contains('tr', 'Credit').should('contain', generateDepositAmount);
    cy.contains('tr', 'Debit').should('contain', generateWithdrawAmount);

    cy.contains('Back').click();
    cy.get('#accountSelect').select('1002');
    cy.contains('Transactions').click();
    cy.contains('tr', 'Credit').should('not.exist');
    cy.contains('tr', 'Debit').should('not.exist');

    cy.get('.logout').click();
    cy.get('#userSelect').should('be.visible');
  });
});
