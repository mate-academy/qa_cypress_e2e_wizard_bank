/// <reference types='cypress' />
import { faker } from '@faker-js/faker';

describe('Bank app', () => {
  const depositAmount = `${faker.number.int({ min: 500, max: 1000 })}`;
  const withdrawAmount = `${faker.number.int({ min: 50, max: 500 })}`;
  const balance = depositAmount - withdrawAmount;
  const user = 'Hermoine Granger';
  const accountNumber = '1002';
  const transactionType = ['Credit', 'Debit'];

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with bank account', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('#userSelect').select(user);
    cy.contains('.btn', 'Login').click();

    cy.get('#accountSelect').select(accountNumber);
    cy.contains('strong', accountNumber).should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', '0')
      .should('be.visible');
    cy.contains('.ng-binding', 'Pound').should('be.visible');

    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type(depositAmount);
    cy.contains('[type="submit"]', 'Deposit').click();

    cy.get('[ng-show="message"]').should('contain', 'Deposit Successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', depositAmount)
      .should('be.visible');

    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw').should('be.visible');
    cy.get('[placeholder="amount"]').type(withdrawAmount);
    cy.contains('[type="submit"]', 'Withdraw').click();

    cy.get('[ng-show="message"]').should('contain', 'Transaction successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balance)
      .should('be.visible');

    cy.get('[ng-class="btnClass1"]').click();

    cy.contains('td', 'Credit')
      .parent()
      .contains('td', depositAmount)
      .should('exist');
    cy.contains('td', 'Debit')
      .parent()
      .contains('td', withdrawAmount)
      .should('exist');

    cy.get('[ng-click="back()"]').click();

    cy.get('#accountSelect').select('1002');

    cy.get('[ng-click="transactions()"]').click();

    for (const t of transactionType) {
      cy.contains('td', t).should('not.exist');
    }

    cy.get('.logout').click();

    cy.get('#userSelect').should('exist');
  });
});
