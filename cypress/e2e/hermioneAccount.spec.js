import { faker } from '@faker-js/faker';

describe('Wizard Bank - Hermione Granger Account Tests', () => {
  const depositAmount = faker.number.int({ min: 100, max: 1000 });
  const withdrawAmount = faker.number.int({ min: 10, max: 99 });
  const expectedBalance = depositAmount - withdrawAmount;

  const user = 'Hermione Granger';
  const mainAccount = '1001';
  const secondaryAccount = '1002';

  beforeEach(() => {
    cy.visit('/#/login');
  });

  it('should complete the full banking workflow for Hermione Granger', () => {
    cy.contains('button', 'Customer Login').click();
    cy.get('#userSelect').select(user);
    cy.contains('button', 'Login').click();

    // Select main account
    cy.get('#accountSelect').select(mainAccount);

    // Assert account number
    cy.contains('[ng-hide="noAccount"]', 'Account Number').then(($block) => {
      cy.wrap($block).find('strong').last().should('contain', mainAccount);
    });

    // Assert initial balance
    cy.contains('[ng-hide="noAccount"]', 'Balance').then(($block) => {
      cy.wrap($block).find('strong').last().should('contain', '0');
    });

    // Assert currency
    cy.contains('[ng-hide="noAccount"]', 'Currency').then(($block) => {
      cy.wrap($block).find('strong').last().should('contain', 'Pound');
    });

    // -------------------------
    //        DEPOSIT
    // -------------------------
    cy.get('[ng-click="deposit()"]').click();

    cy.get('input[placeholder="amount"]').then(($input) => {
      cy.wrap($input).clear();
      cy.wrap($input).type(depositAmount);
    });

    cy.contains('button', 'Deposit').click();

    cy.get('[ng-show="message"]')
      .should('be.visible')
      .and('contain', 'Deposit Successful');

    cy.contains('[ng-hide="noAccount"]', 'Balance').then(($block) => {
      cy.wrap($block).find('strong').last().should('contain', depositAmount);
    });

    // -------------------------
    //        WITHDRAW
    // -------------------------
    cy.get('[ng-click="withdrawl()"]').click();

    cy.get('input[placeholder="amount"]').then(($input) => {
      cy.wrap($input).clear();
      cy.wrap($input).type(withdrawAmount);
    });

    cy.contains('button', 'Withdraw').click();

    cy.get('[ng-show="message"]')
      .should('be.visible')
      .and('contain', 'Transaction successful');

    cy.contains('[ng-hide="noAccount"]', 'Balance').then(($block) => {
      cy.wrap($block).find('strong').last().should('contain', expectedBalance);
    });

    // -------------------------
    //     TRANSACTIONS
    // -------------------------
    cy.get('[ng-click="transactions()"]').click();

    cy.get('tbody tr').eq(0)
      .should('contain', depositAmount)
      .and('contain', 'Credit');

    cy.get('tbody tr').eq(1)
      .should('contain', withdrawAmount)
      .and('contain', 'Debit');

    cy.contains('button', 'Back').click();

    // -------------------------
    //   SWITCH ACCOUNT
    // -------------------------
    cy.get('#accountSelect').select(secondaryAccount);
    cy.get('[ng-click="transactions()"]').click();

    cy.get('tbody tr').should('have.length', 0);

    cy.contains('button', 'Back').click();

    // -------------------------
    //        LOGOUT
    // -------------------------
    cy.contains('button', 'Logout').click();
    cy.get('#userSelect').should('be.visible');
  });
});
