/// <reference types='cypress' />

import { faker } from '@faker-js/faker';

describe('Bank app', () => {
  const deposit = faker.number.int({ min: 500, max: 1500 });
  const withdrawl = faker.number.int({ min: 100, max: deposit });
  const balance = deposit - withdrawl;
  const accountNumber = '1001';

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('button', 'Customer Login').click();
    cy.get('select#userSelect').select('Hermoine Granger');
    cy.contains('button', 'Login').click();

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', accountNumber)
      .should('be.visible');
    cy.contains('.ng-binding', 'Dollar')
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', '0');

    cy.get('[ng-class="btnClass1"]').click();
    cy.contains('Date-Time');
    cy.contains('Amount');
    cy.contains('Transaction Type');

    cy.contains('[ng-show="showDate"]', 'Reset').click();
    cy.contains('Credit').should('not.exist');
    cy.contains('Debit').should('not.exist');
    cy.contains('button', 'Back').click();

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .find('strong')
      .invoke('text')
      .then(() => {
        cy.get('[ng-click="deposit()"]').click();
        cy.get('[placeholder="amount"]').type(deposit);
        cy.contains('[type="submit"]', 'Deposit').click();

        cy.get('[ng-show="message"]')
          .should('contain', 'Deposit Successful');
        cy.contains('[ng-hide="noAccount"]', 'Balance')
          .contains('strong', deposit);

        cy.get('[ng-click="withdrawl()"]').click();
        cy.contains('[type="submit"]', 'Withdraw')
          .should('be.visible');
        cy.get('[placeholder="amount"]').type(withdrawl);
        cy.contains('[type="submit"]', 'Withdraw').click();

        cy.get('[ng-show="message"]')
          .should('contain', 'Transaction successful');
        cy.contains('[ng-hide="noAccount"]', 'Balance')
          .contains('strong', balance);

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(3000);

        cy.get('[ng-class="btnClass1"]').click();
        cy.contains('Date-Time');
        cy.contains('Amount');
        cy.contains('Transaction Type');
        cy.contains('Credit');
        cy.contains('Debit');

        cy.contains('[ng-show="showDate"]', 'Reset').click();
        cy.contains('Credit').should('not.exist');
        cy.contains('Debit').should('not.exist');

        cy.contains('button', 'Back').click();
        cy.get('select#accountSelect').select(1);
        cy.get('[ng-class="btnClass1"]').click();
        cy.contains('Credit').should('not.exist');
        cy.contains('Debit').should('not.exist');

        cy.get('[ng-show="logout"]').click();
        cy.contains('label', 'Your Name :').should('exist');
      });
  });
});
