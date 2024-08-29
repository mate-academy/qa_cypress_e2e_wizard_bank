/// <reference types='cypress' />

import { faker } from '@faker-js/faker';

describe('Bank app', () => {
  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    const deposit = faker.datatype.number({ min: 10, max: 1000 });
    const withdraw = faker.datatype.number({ min: 10, max: deposit - 1 });

    cy.contains('.btn', 'Customer Login').click();

    cy.get('#userSelect').select('1');
    cy.contains('.btn', 'Login').click();
    cy.get('#accountSelect').select('1001');

    cy.contains('.center', 'Balance');
    cy.contains('.ng-binding', '5096');
    cy.contains('.center', 'Currency');
    cy.contains('.ng-binding', 'Dollar');

    cy.contains('.btn', 'Deposit').click();
    cy.get('[placeholder=amount]').type(deposit);
    cy.contains('[type="submit"]', 'Deposit').click();
    cy.contains('.error', 'Deposit Successful');

    cy.contains('.center', 'Balance');
    cy.contains('.ng-binding', (5096 + deposit));

    cy.contains('.btn', 'Withdraw').click();
    cy.get('[placeholder=amount]').type(withdraw);
    cy.contains('[type="submit"]', 'Withdraw').click();
    cy.get('[placeholder=amount]').type(withdraw);
    cy.contains('[type="submit"]', 'Withdraw').click();
    cy.contains('.error', 'Transaction successful');

    cy.contains('.center', 'Balance');
    cy.contains('.ng-binding', (5096 + deposit - withdraw));

    cy.contains('.btn', 'Transactions').click();
    cy.contains('.ng-binding', 'Credit');
    cy.contains('.ng-binding', 'Debit');

    cy.contains('.btn', 'Back').click();
    cy.get('#accountSelect').select('1002');
    cy.contains('.btn', 'Transactions').click();
    cy.get('table').should('not.contain', 'Credit');
    cy.get('table').should('not.contain', 'Debit');
    cy.contains('.btn', 'Logout').click();
    cy.get('#userSelect').select('---Your Name---');
  });
});
