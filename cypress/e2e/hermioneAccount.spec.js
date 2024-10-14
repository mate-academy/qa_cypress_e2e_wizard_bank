import { faker } from '@faker-js/faker';
/// <reference types='cypress' />

describe('Hermione Granger Account Flow', () => {
  const depositAmount = faker.number.int({ min: 500, max: 1000 });
  const withdrawAmount = faker.number.int({ min: 50, max: 500 });
  const user = 'Hermoine Granger';
  const accountNumber = '1001';

  before(() => {
    cy.visit('/');
  });

  it('should check bank account flow for Hermione Granger', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('[name="userSelect"]').select(user);
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
    cy.get('[placeholder="amount"]').type(depositAmount.toString());
    cy.contains('[type="submit"]', 'Deposit').click();

    cy.get('[ng-show="message"]')
      .should('contain', 'Deposit Successful');

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', depositAmount.toString(), { timeout: 10000 })
      .should('be.visible');

    cy.get('[ng-click="withdrawl()"]').click();
    cy.get('[placeholder="amount"]').type(withdrawAmount.toString());
    cy.contains('[type="submit"]', 'Withdraw').click();

    cy.get('[ng-show="message"]')
      .should('contain', 'Transaction successful');

    const finalBalance = depositAmount - withdrawAmount;
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', finalBalance.toString())
      .should('be.visible');

    cy.get('[ng-click="transactions()"]').click();
    cy.get('tbody tr').should('have.length', 2);
    cy.get('tbody tr').eq(0).should('contain', 'Deposit');
    cy.get('tbody tr').eq(1).should('contain', 'Withdraw');

    cy.get('[ng-click="back()"]').click();

    cy.get('[name="accountSelect"]').select('1002');

    cy.get('[ng-click="transactions()"]').click();
    cy.get('tbody tr').should('have.length', 0);

    cy.get('[ng-click="logout()"]').click();
    cy.contains('Your Name').should('be.visible');
  });
});
