import { faker } from '@faker-js/faker';
/// <reference types='cypress' />

describe('Bank app', () => {
  const depositAmount = `${faker.number.int({ min: 500, max: 1000 })}`;
  const withdrawAmount = `${faker.number.int({ min: 50, max: 500 })}`;
  const user = 'Hermoine Granger';
  const accountNumber = '1001';
  const accountNumber2 = '1002';
  const accountBalance = '5096';
  const accountCurrency = 'Dollar';
  const balance2 = +accountBalance + +depositAmount;
  const balance3 = +balance2 - +withdrawAmount;
  const depositSuccessMessage = 'Deposit Successful';
  const wirthDrawlSuccessMessage = 'Transaction successful';

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with bank account', () => {
    cy.contains('.btn', 'Customer Login').click();

    cy.get('[name="userSelect"]').select(user);

    cy.contains('.btn', 'Login').click();

    cy.get('.fontBig').should('contain', user);

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .should('contain', accountNumber);

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .should('contain', accountBalance);

    cy.contains('[ng-hide="noAccount"]', 'Currency')
      .should('contain', accountCurrency);

    cy.get('[ng-click="deposit()"]').click();

    cy.get('[placeholder="amount"]').type(depositAmount);

    cy.contains('[type="submit"]', 'Deposit').click();

    cy.contains('.error', depositSuccessMessage).should('be.visible');

    cy.contains('[ng-hide="noAccount"]', 'Balance').should('contain', balance2);

    cy.get('[ng-click="withdrawl()"]').click();

    cy.contains('[type="submit"]', 'Withdraw')
      .should('be.visible');

    cy.get('[placeholder="amount"]').type(withdrawAmount);

    cy.contains('[type="submit"]', 'Withdraw').click();

    cy.contains('.error', wirthDrawlSuccessMessage).should('be.visible');

    cy.contains('[ng-hide="noAccount"]', 'Balance').should('contain', balance3);

    cy.get('[ng-click="transactions()"]').click();

    cy.get('td.ng-binding').should('contain', depositAmount);

    cy.get('td.ng-binding').should('contain', withdrawAmount);

    cy.get('[ng-click="back()"]').click();

    cy.get('#accountSelect').select(accountNumber2);

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .should('contain', accountNumber2);

    cy.get('[ng-click="transactions()"]').click();

    cy.get('td.ng-binding').should('not.exist');

    cy.get('[ng-click="byebye()"]').click();

    cy.get('[name="userSelect"]').should('be.visible');
  });
});
