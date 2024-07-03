/// <reference types='cypress' />
import { faker } from '@faker-js/faker';

describe('Bank app', () => {
  const deposit = faker.datatype.number({ min: 1, max: 5000 });
  const withdrawl = faker.datatype.number({ min: 1, max: 500 });
  const user = 'Hermoine Granger';
  const currentBalance = 5096;
  const balance = currentBalance + deposit - withdrawl;
  const accountNumber = 1002;

  before(() => {
    cy.visit('#/login');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.get('.borderM .btn-primary.btn-lg')
      .contains('Customer Login')
      .click();

    cy.get('label')
      .should('have.text', 'Your Name :');

    cy.get('#userSelect')
      .select(user);

    cy.get('form.ng-valid > .btn')
      .click();

    cy.get('[ng-hide="noAccount"]')
      .should('contain.text', 'Account Number :');

    cy.get('[ng-hide="noAccount"]')
      .should('contain', currentBalance);

    cy.get('[ng-hide="noAccount"]')
      .should('contain.text', 'Currency :');

    cy.get('button[ng-click="deposit()"]')
      .click();

    cy.get('input[placeholder="amount"]')
      .type(deposit);

    cy.get('button[type="submit"]')
      .click();

    cy.get('span[ng-show="message"]')
      .should('have.text', 'Deposit Successful');

    cy.get('[ng-hide="noAccount"]')
      .should('contain', (currentBalance + deposit));

    cy.get('button[ng-click="withdrawl()"]')
      .click();

    cy.get('label')
      .should('have.text', 'Amount to be Withdrawn :');

    cy.get('[placeholder="amount"]')
      .type(withdrawl);

    cy.get('button[type="submit"]')
      .click();

    cy.get('span[ng-show="message"]')
      .should('have.text', 'Transaction successful');

    cy.get('.borderM > :nth-child(3)')
      .should('contain.text', balance);

    cy.get('button[ng-click="transactions()"]')
      .click();

    cy.get('table')
      .should('contain', deposit)
      .and('contain', withdrawl);

    cy.get('button[ng-click="back()"]')
      .click();

    cy.get('#accountSelect').select(accountNumber);

    cy.get('button[ng-click="transactions()"]')
      .click();

    cy.get('table')
      .should('not.contain', deposit)
      .and('not.contain', withdrawl);

    cy.get('button[ng-click="byebye()"]')
      .click();

    cy.get('button.logout')
      .should('not.be.visible');
  });
});
