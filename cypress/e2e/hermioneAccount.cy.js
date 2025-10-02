/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

describe('Bank app - Hermione Granger flow (stable)', () => {
  before(() => {
    cy.visit('/');
  });

  // ✅ Helper: wait until balance matches expected value
  function waitForBalance(expectedBalance) {
    cy.get('.center strong:nth-child(2)', { timeout: 10000 })
      .should(($el) => {
        const balance = Number($el.text());
        expect(balance).to.eq(expectedBalance);
      });
  }

  // ✅ Helper: safely enter an amount
  function enterAmount(value) {
    cy.get('input[ng-model="amount"]', { timeout: 10000 })
      .should('exist')
      .and('be.visible')
      .scrollIntoView();

    cy.get('input[ng-model="amount"]').clear();
    cy.get('input[ng-model="amount"]').type(value.toString());
  }

  it('should allow working with Hermione bank account', () => {
    // ---- Customer Login ----
    cy.contains('Customer Login').click();

    // Select Hermione by visible text
    cy.get('#userSelect', { timeout: 10000 }).select('Hermione Granger');
    cy.contains('Login').click();

    // Verify account details
    cy.get('.center strong:nth-child(1)').should('contain.text', '1001');
    cy.get('.center strong:nth-child(3)').should('contain.text', 'Dollar');

    // ✅ Explicit balance check (numeric presence)
    cy.get('.center strong:nth-child(2)')
      .invoke('text')
      .should((text) => {
        expect(Number(text)).to.be.a('number');
      });

    // ---- Capture initial balance ----
    cy.get('.center strong:nth-child(2)').invoke('text')
      .then((text) => Number(text))
      .then((initialBalance) => {
        // ---- Deposit ----
        const depositValue = faker.number.int({ min: 100, max: 500 });
        cy.log(`Depositing: ${depositValue}`);

        cy.contains('Deposit').click();
        enterAmount(depositValue);
        cy.get('form button').contains('Deposit').click();

        // ✅ Assert success message
        cy.contains('Deposit Successful').should('be.visible');

        waitForBalance(initialBalance + depositValue);

        // ---- Withdraw ----
        cy.get('.center strong:nth-child(2)').invoke('text')
          .then((text) => Number(text))
          .then((balanceAfterDeposit) => {
            const withdrawValue = faker.number.int({
              min: 10,
              max: balanceAfterDeposit
            });
            cy.log(`Withdrawing: ${withdrawValue}`);

            cy.contains('Withdrawl').click();
            enterAmount(withdrawValue);
            cy.get('form button').contains('Withdraw').click();

            // ✅ Assert success message
            cy.contains('Transaction successful').should('be.visible');

            waitForBalance(balanceAfterDeposit - withdrawValue);

            // ---- Transactions check ----
            cy.contains('Transactions').click();

            // At least 2 transactions
            cy.get('table tbody tr').should('have.length.at.least', 2);

            // ✅ Assert Credit with exact amount
            cy.get('table tbody tr').eq(0)
              .should('contain.text', depositValue)
              .and('contain.text', 'Credit');

            // ✅ Assert Debit with exact amount
            cy.get('table tbody tr').eq(1)
              .should('contain.text', withdrawValue)
              .and('contain.text', 'Debit');
          });

        // ---- Back & switch account ----
        cy.contains('Back').click();

        // Select another account by label/value instead of index
        cy.get('#accountSelect').should('be.visible').select('1002');
        cy.contains('Transactions').click();
        cy.get('table tbody tr').should('have.length', 0);

        // ---- Logout ----
        cy.contains('Back').click();
        cy.contains('Logout').click();
        cy.get('#userSelect').should('be.visible');
      });
  });
});
