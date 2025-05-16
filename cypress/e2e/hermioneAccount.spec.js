/* eslint-disable max-len */
import { faker } from '@faker-js/faker';
/// <reference types='cypress' />

describe('Bank app', () => {
  const depositAmount = faker.number.int({ min: 500, max: 1000 });
  const withdrawAmount = faker.number.int({ min: 50, max: 500 });

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('Customer Login').click();

    cy.get('#userSelect').select('Hermione Granger');

    cy.get('button[type="submit"]').click();

    cy.get('.center strong').eq(0).should('have.text', '1001');
    cy.get('.center strong')
      .eq(1)
      .then(($balance) => {
        const initialBalance = parseFloat($balance.text());

        cy.get('.center strong').eq(2).should('have.text', 'Dollar');

        cy.contains('Deposit').click();
        cy.get('input[ng-model="amount"]').type(`${depositAmount}`);
        cy.get('button[type="submit"]').contains('Deposit').click();

        cy.get('.error').should('contain.text', 'Deposit Successful');

        cy.get('.center strong')
          .eq(1)
          .should('have.text', (`${initialBalance + depositAmount}`).toString());

        cy.contains('Withdrawl').click();
        cy.get('input[ng-model="amount"]').type(`${withdrawAmount}`);
        cy.get('button[type="submit"]').contains('Withdraw').click();

        cy.get('.error').should('contain.text', 'Transaction successful');

        cy.get('.center strong')
          .eq(1)
          .should('have.text', (`${initialBalance + depositAmount - withdrawAmount}`).toString());

        cy.contains('Transactions').click();

        cy.get('table tbody tr').should('have.length', 2);
        cy.get('table tbody tr').eq(0).should('contain.text', 'Credit');
        cy.get('table tbody tr').eq(1).should('contain.text', 'Debit');

        cy.contains('Back').click();

        cy.get('#accountSelect').select('1002');
        cy.contains('Transactions').click();

        cy.get('table tbody tr').should('have.length', 0);

        cy.contains('Logout').click();

        cy.contains('Your Name :').should('exist');
      });
  });
});
