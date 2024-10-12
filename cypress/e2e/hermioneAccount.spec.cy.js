/// <reference types='cypress' />
import { faker } from '@faker-js/faker';

describe('Bank app', () => {
  const depositAmount = `${faker.number.int({ min: 500, max: 1000 })}`;
  const withdrawAmount = `${faker.number.int({ min: 50, max: 500 })}`;
  const balance = depositAmount - withdrawAmount;
  const user = 'Hermoine Granger';
  const accountNumber = '1003';
  const currency = 'Rupee';
  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.get('[ng-click="customer()"]').click();
    cy.get('#userSelect').select(user);
    cy.contains('Login').click();

    cy.get('#accountSelect').select(accountNumber);
    cy.get('#accountSelect').should('have.value', `number:${accountNumber}`);

    cy.assertTab(0, currency);

    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type(depositAmount);
    cy.get('form.ng-dirty > .btn').click();

    cy.get('.error').should('exist').and('be.visible');

    cy.assertTab(depositAmount, currency);

    cy.get('[ng-click="withdrawl()"]').click();
    cy.get('[placeholder="amount"]').type(withdrawAmount);
    cy.get('form.ng-dirty > .btn').click();

    cy.assertTab(balance, currency);

    cy.get('.error').should('exist').and('be.visible');

    cy.get('[ng-click="transactions()"]').click();

    cy.get('table').find('tbody tr').should('have.length', 2);

    cy.get('.fixedTopBox > [style="float:left"]').click();

    cy.get('#accountSelect').select('1002');

    cy.get('[ng-click="transactions()"]').click();

    cy.get('table').find('tbody tr').should('have.length', 0);

    cy.get('.logout').click();

    cy.url().should('contain', '/customer');
  });
});
