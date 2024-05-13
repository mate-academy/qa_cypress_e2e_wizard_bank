/// <reference types='cypress' />

import { faker } from '@faker-js/faker';

describe('Bank app', () => {
  const depositAmount = `${faker.number.int({ min: 100, max: 1000 })}`;
  const withdrawAmount = `${faker.number.int({ min: 50, max: 500 })}`;
  const user = 'Hermoine Granger';
  const accountNumber = '1001';
  const startBalance = 5096;
  const balance = startBalance + parseInt(depositAmount) -
    parseInt(withdrawAmount);

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('.btn', 'Customer Login').click();

    cy.get('#userSelect').select(user);

    cy.contains('.btn', 'Login').click();

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', accountNumber)
      .should('be.visible');

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', '0')
      .should('be.visible');

    cy.contains('.ng-binding', 'Dollar')
      .should('be.visible');

    cy.get('[ng-click="deposit()"]').click();

    cy.get('[placeholder="amount"]').type(depositAmount);

    cy.contains('[type="submit"]', 'Deposit').click();

    cy.get('[ng-show="message"]')
      .should('contain', 'Deposit Successful');

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .should('contain', startBalance + parseInt(depositAmount));

    cy.get('[ng-click="withdrawl()"]').click();

    cy.contains('[type="submit"]', 'Withdraw').should('be.visible');

    cy.get('[placeholder="amount"]').type(withdrawAmount);

    cy.contains('[type="submit"]', 'Withdraw').click();

    cy.get('[ng-show="message"]')
      .should('contain', 'Transaction successful');

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balance);

    cy.get('[ng-click="transactions()"]').click();
    cy.get('.fixedTopBox > [style="float:left"]').click();
    cy.get('[ng-click="transactions()"]').click();

    cy.get('td.ng-binding').should('contain', depositAmount);

    cy.get('td.ng-binding').should('contain', withdrawAmount);

    cy.get('[ng-click="back()"]').click();

    cy.get('#accountSelect').select('1002');

    cy.get('[ng-click="transactions()"]').click();

    cy.get('td.ng-binding').should('not.exist');

    cy.get('.logout').click();

    cy.get('#userSelect').should('be.visible');
  });
});
