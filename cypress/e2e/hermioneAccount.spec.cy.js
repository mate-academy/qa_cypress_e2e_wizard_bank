/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

describe('Bank app', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    const depositAmount = faker.number.int({ min: 50, max: 1000 });
    const withdrawAmount = faker.number.int({ min: 10, max: 500 });
    const user = 'Hermoine Granger';
    const accountNumber = '1001';

    cy.contains('.btn', 'Customer Login').click();

    cy.get('[name="userSelect"]').select(user);

    cy.contains('.btn', 'Login').click();

    cy.get('#accountSelect').select(accountNumber);

    cy.contains('.center', 'Balance');
    cy.contains('.ng-binding', '5096');
    cy.contains('.center', 'Currency');
    cy.contains('.ng-binding', 'Dollar');

    cy.contains('.btn', 'Deposit').click();

    cy.get('[placeholder=amount]').type(depositAmount);
    cy.contains('[type="submit"]', 'Deposit').click();

    cy.contains('.error', 'Deposit Successful');

    cy.contains('.ng-binding', 5096 + depositAmount);
    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw')
      .should('be.visible');
    cy.get('[placeholder="amount"]').type(withdrawAmount);
    cy.contains('[type="submit"]', 'Withdraw').click();

    cy.get('[ng-show="message"]')
      .should('contain', 'Transaction successful');
    cy.contains('.center', 'Balance');
    cy.contains('.ng-binding', (5096 + depositAmount - withdrawAmount));
    cy.contains('Transactions').click();
    cy.get('table').contains('Credit').should('exist');
    cy.get('table').contains('Debit').should('exist');
    cy.contains('Back').click();
    cy.get('#accountSelect').select('1002');
    cy.contains('Transactions').click();
    cy.get('table').should('not.contain', 'Credit');
    cy.get('table').should('not.contain', 'Debit');
    cy.contains('Logout').click();
    cy.get('#userSelect').should('have.value', '');
  });
});
