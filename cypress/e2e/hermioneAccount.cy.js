/// <reference types="cypress" />

describe('Hermione Granger Bank Account Flow', () => {
  const depositAmount = 1000;
  const withdrawAmount = 500;
  const accountInfoSelector = '[ng-hide="noAccount"]';

  before(() => {
    cy.visit(
      'https://www.globalsqa.com/angularJs-protractor/' +
            'BankingProject/#/login'
    );
    cy.loginAsHermione();
  });

  it(
    'should allow deposit and withdraw, check balances, and transactions',
    () => {
      cy.get('[placeholder="amount"]').clear();
      cy.get('[placeholder="amount"]').type(String(depositAmount));
      cy.get('[ng-click="deposit()"]').click();

      cy.get('[placeholder="amount"]').clear();
      cy.get('[placeholder="amount"]').type(String(depositAmount));

      cy.get(accountInfoSelector)
        .contains('strong', depositAmount)
        .should('be.visible');

      cy.get('[ng-show="message"]').should(
        'contain.text',
        'Deposit Successful'
      );

      cy.get('[placeholder="amount"]').clear();
      cy.get('[placeholder="amount"]').type(String(withdrawAmount));

      // Check balance after deposit
      cy.get(accountInfoSelector)
        .contains('strong', depositAmount)
        .should('be.visible');

      // --- Withdraw ---
      cy.get('[ng-click="withdrawl()"]').click();
      cy.get('[placeholder="amount"]').clear();
      cy.get('[placeholder="amount"]').type(String(withdrawAmount));
      cy.contains('[type="submit"]', 'Withdraw')
        .should('be.visible')
        .click();

      cy.get('[ng-show="message"]').should(
        'contain.text',
        'Transaction successful'
      );

      // Check balance after withdraw
      cy.get(accountInfoSelector).contains('strong').invoke('text');
      cy.get('table tbody tr').should('have.length.at.least', 2);

      cy.get(accountInfoSelector)
        .contains('strong')
        .invoke('text')
        .then((text) => {
          const currentBalance = Number(text);
          const expectedBalance = depositAmount - withdrawAmount;
          expect(currentBalance).to.eq(expectedBalance);
        });

      cy.get('#userSelect').should('be.visible');

      // New account has 0 balance
      cy.get(accountInfoSelector)
        .contains('strong', '0')
        .should('be.visible');

      // --- Transactions ---
      cy.get('[ng-click="transactions()"]').click();
      cy.get('table tbody tr').should('have.length.at.least', 2);
      cy.contains('td', depositAmount).should('be.visible');
      cy.contains('td', withdrawAmount).should('be.visible');

      // --- Back and switch account ---
      cy.contains('.btn', 'Back').click();
      cy.get('#userSelect')
        .should('be.visible')
        .select('Harry Potter');
      cy.get('#userSelect')
        .should('contain', 'Harry Potter');
      cy.contains('.btn', 'Login').should('be.visible').click();
      cy.get(accountInfoSelector)
        .contains('strong', '0')
        .should('be.visible'); // New account has 0 balance

      // --- Logout ---
      cy.contains('.btn', 'Logout').should('be.visible').click();
      cy.url().should('include', '/login');
      cy.contains('.btn', 'Customer Login').should('be.visible');
    }
  );
});
