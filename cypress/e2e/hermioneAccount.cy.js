/// <reference types="cypress" />

describe('Hermione Account Flow', () => {
  beforeEach(() => {
    cy.visit('https://globalsqa.com/angularJs-protractor/BankingProject/');

    cy.contains('Customer Login', { timeout: 10000 }).click();

    cy.get('select', { timeout: 10000 })
      .find('option')
      .should('have.length.greaterThan', 1);

    cy.get('select').select('Hermoine Granger');
    cy.contains('Login').click();

    cy.url({ timeout: 10000 }).should('include', '/customer');
  });

  it('should check account details', () => {
    cy.url({ timeout: 10000 }).should('include', '/customer');

    // eslint-disable-next-line max-len
    cy.get('strong.ng-binding', { timeout: 10000 }).eq(0).should('contain', '1001');
    cy.get('strong.ng-binding').eq(2).should('contain', 'Dollar');
  });

  it('should deposit money', () => {
    cy.contains('Deposit', { timeout: 10000 }).click();
    cy.get('input[ng-model="amount"]').type('100');
    cy.get('button[type="submit"]').contains('Deposit').click();

    // eslint-disable-next-line max-len
    cy.get('.error', { timeout: 10000 }).should('contain', 'Deposit Successful').and('be.visible');
  });

  it('should withdraw money', () => {
    cy.contains('Withdrawl', { timeout: 10000 }).click();
    cy.get('input[ng-model="amount"]').type('50');
    cy.get('button[type="submit"]').contains('Withdraw').click();

    // eslint-disable-next-line max-len
    cy.get('.error', { timeout: 10000 }).should('contain', 'Transaction successful').and('be.visible');
  });

  it('should show both transactions', () => {
    cy.contains('Transactions', { timeout: 10000 }).click();

    cy.get('tbody tr', { timeout: 10000 }).should('have.length.at.least', 2);
    cy.get('tbody tr').first().should('contain.text', 'Credit');
    cy.get('tbody tr').eq(1).should('contain.text', 'Debit');

    cy.contains('Back').click();
  });

  it('should show no transactions for another account', () => {
    cy.get('select').select(1);
    cy.contains('Transactions').click();
    cy.get('tbody tr', { timeout: 10000 }).should('have.length', 0);
    cy.contains('Back').click();
  });

  it('should logout Hermione successfully', () => {
    cy.contains('Logout', { timeout: 10000 }).click();
    // eslint-disable-next-line max-len
    cy.get('button.home', { timeout: 10000 }).should('contain', 'Home').and('be.visible');
  });
});
