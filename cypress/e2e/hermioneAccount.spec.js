import { faker } from '@faker-js/faker';
/// <reference types='cypress' />

describe('Bank app', () => {
  let balance;
  const depositAmount = faker.number.int({ min: 500, max: 1000 });
  const withdrawAmount = faker.number.int({ min: 50, max: depositAmount });
  const user = 'Hermione Granger';
  const accountNumber = '1001';

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('[name="userSelect"]').select(user);
    cy.contains('.btn', 'Login').click();

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', accountNumber)
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .find('strong').invoke('text').then((text) => {
        balance = +text;
      });
    cy.contains('.ng-binding', 'Dollar')
      .should('be.visible');

    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type(depositAmount);
    cy.contains('[type="submit"]', 'Deposit').click();

    cy.get('[ng-show="message"]')
      .should('contain', 'Deposit Successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balance + depositAmount)
      .should('be.visible');

    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw')
      .should('be.visible');
    cy.get('[placeholder="amount"]').type(withdrawAmount);
    cy.contains('[type="submit"]', 'Withdraw').click();

    cy.get('[ng-show="message"]')
      .should('contain', 'Transaction successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balance + depositAmount - withdrawAmount)
      .should('be.visible');

    cy.get('[ng-click="transactions()"]').click();
    cy.get('table').within(() => {
      cy.contains('td', depositAmount).should('be.visible');
      cy.contains('td', withdrawAmount).should('be.visible');
    });

    cy.get('[ng-click="back()"]').click();

    cy.get('#accountSelect').select(1);
    cy.get('[ng-click="transactions()"]').click();
    cy.get('table').within(() => {
      cy.get('td').should('not.exist');
    });

    cy.contains('.btn', 'Logout').click();
    cy.contains('.btn', 'Customer Login')
      .should('be.visible');
  });
});
