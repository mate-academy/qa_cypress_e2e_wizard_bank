import { faker } from '@faker-js/faker';
/// <reference types='cypress' />

describe('Bank app', () => {
  const depositAmount = `${faker.number.int({ min: 500, max: 1000 })}`;
  const withdrawAmount = `${faker.number.int({ min: 50, max: 500 })}`;
  const balance = depositAmount - withdrawAmount;
  const user = 'Hermoine Granger';
  const accountNumber = '1001';

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with bank account', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('[name="userSelect"]').select(user);
    cy.contains('.btn', 'Login').click();

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', accountNumber)
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', '0')
      .should('be.visible');
    cy.contains('.ng-binding', 'Dollar').should('be.visible');

    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type(depositAmount);
    cy.contains('[type="submit"]', 'Deposit').click();

    cy.get('[ng-show="message"]').should('contain', 'Deposit Successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', 5096 + +depositAmount)
      .should('be.visible');

    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw').should('be.visible');
    cy.get('[placeholder="amount"]').type(withdrawAmount);
    cy.contains('[type="submit"]', 'Withdraw').click();

    cy.get('[ng-show="message"]').should('contain', 'Transaction successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', 5096 + +balance)
      .should('be.visible');

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);
    cy.contains('button', 'Transactions').click();

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(200);
    cy.contains('tr', 'Debit').should('be.visible');
    cy.contains('tr', 'Credit').should('be.visible');

    cy.contains('button', 'Back').click();

    cy.get('select[id="accountSelect"]').select('1002');

    cy.contains('button', 'Transactions').click();

    cy.contains('tr', 'Debit').should('not.exist');
    cy.contains('tr', 'Credit').should('not.exist');

    cy.contains('button', 'Logout').click();

    cy.contains('button', 'Logout').should('not.be.visible');
  });
});
