/// <reference types='cypress' />
import { faker } from '@faker-js/faker';

describe('Bank app', () => {
  const user = 'Hermoine Granger';
  const accountNumber = '1001';
  const secondaryAccountNumber = '1002';
  const startDate = '2025-04-01T00:00';
  const balance = 5096;
  const deposit = +`${faker.number.int({ min: 100, max: 1000 })}`;
  const withdrawn = +`${faker.number.int({ min: 100, max: 500 })}`;

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermion bank account', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('#userSelect').select(user);
    cy.contains('.btn', 'Login').click();

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', accountNumber)
      .should('be.visible');

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', balance)
      .should('be.visible');

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', 'Dollar')
      .should('be.visible');

    cy.get('[ng-class="btnClass2"]').click();
    cy.get('[placeholder="amount"]').type(deposit);
    cy.contains('[type="submit"]', 'Deposit').click();

    cy.get('[ng-show="message"]')
      .should('contain.text', 'Deposit Successful')
      .should('be.visible');

    cy.contains('[ng-hide=noAccount]', 'Account Number')
      .contains('strong', balance + deposit)
      .should('be.visible');

    cy.get('[ng-class="btnClass3"]').click();
    cy.contains('[type="submit"]', 'Withdraw').should('be.visible');
    cy.get('[placeholder="amount"]').type(withdrawn);
    cy.contains('[type="submit"]', 'Withdraw').click();
    cy.get('[ng-show="message"]')
      .should('contain.text', 'Transaction successful')
      .should('be.visible');

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', balance + deposit - withdrawn)
      .should('be.visible');

    cy.get('[ng-class="btnClass1"]').click();

    cy.get('#start').type(startDate);
    cy.get('#start').should('have.value', startDate);

    cy.get('#anchor0 > :nth-child(3)').should('contain.text', 'Credit');
    cy.get('#anchor0 > :nth-child(2)').should('contain.text', deposit);

    cy.get('#anchor1 > :nth-child(3)').should('contain.text', 'Debit');
    cy.get('#anchor1 > :nth-child(2)').should('contain.text', withdrawn);

    cy.get('[ng-click="back()"]').click();

    cy.get('#accountSelect').select(`number:${secondaryAccountNumber}`);

    cy.get('[ng-class="btnClass1"]').click();

    cy.get('table').should('not.contain', 'tbody tr');

    cy.get('[ng-show="logout"]').click();

    cy.contains('label', 'Your Name :');
  });
});
