/* eslint-disable max-len */
/// <reference types="cypress" />

describe('Bank App Tests', () => {
  beforeEach(() => {
    cy.visit('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login');
  });

  it('should perform banking operations for Hermione Granger', () => {
    // Login as Hermione Granger
    cy.contains('button', 'Customer Login').click();
    cy.get('select[name="userSelect"]').select('Hermione Granger');
    cy.contains('button', 'Login').click();

    // Assert account details
    cy.contains('strong', '1001').should('be.visible'); // Account number
    cy.contains('strong', 'Balance').should('be.visible'); // Balance
    cy.contains('strong', 'Dollar').should('be.visible'); // Currency

    // Deposit operation
    cy.contains('button', 'Deposit').click();
    cy.get('input[placeholder="amount"]').type('500');
    cy.contains('button', 'Deposit').click();
    cy.contains('Deposit Successful').should('be.visible');
    cy.contains('strong', '500').should('be.visible'); // Updated balance

    // Withdrawal operation
    cy.contains('button', 'Withdrawl').click();
    cy.get('input[placeholder="amount"]').type('100');
    cy.contains('button', 'Withdraw').click();
    cy.contains('Transaction successful').should('be.visible');
    cy.contains('strong', '400').should('be.visible'); // Updated balance

    // View transactions
    cy.contains('button', 'Transactions').click();
    cy.contains('Deposit').should('be.visible');
    cy.contains('Withdrawal').should('be.visible');
    cy.contains('button', 'Back').click();

    // Logout
    cy.contains('button', 'Logout').click();
    cy.contains('Customer Login').should('be.visible');
  });
});
