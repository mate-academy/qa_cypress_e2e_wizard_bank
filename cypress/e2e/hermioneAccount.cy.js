/* eslint-disable max-len */
/// <reference types="cypress" />

describe('Bank app', () => {
  before(() => {
    cy.visit('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('#userSelect').select('Hermoine Granger');
    cy.contains('.btn', 'Login').click();

    cy.contains('strong', 'Account Number').next('strong').should('have.text', '1001');
    cy.contains('strong', 'Balance').next('strong').should('have.text', '0');
    cy.contains('strong', 'Currency').next('strong').should('have.text', 'Dollar');

    cy.get('[ng-click="deposit()"]').click();
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('[placeholder="amount"]').clear().type('500');
    cy.contains('[type="submit"]', 'Deposit').click();
    cy.get('[ng-show="message"]').should('contain', 'Deposit Successful');
    cy.contains('strong', 'Balance').next('strong').should('have.text', '500');

    cy.get('[ng-click="withdrawl()"]').click();
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('[placeholder="amount"]').clear().type('400');
    cy.contains('[type="submit"]', 'Withdraw').click();
    cy.get('[ng-show="message"]').should('contain', 'Transaction successful');
    cy.contains('strong', 'Balance').next('strong').should('have.text', '100');

    cy.get('[ng-click="transactions()"]').click();
    cy.get('tbody tr').should('have.length', 2);
    cy.get('tbody tr td:nth-child(2)').then(($cells) => {
      const amounts = [...$cells].map((el) => el.innerText.trim());
      expect(amounts).to.include('500');
      expect(amounts).to.include('400');
    });
    cy.get('tbody tr td:nth-child(3)').then(($cells) => {
      const types = [...$cells].map((el) => el.innerText.trim());
      expect(types).to.include('Credit');
      expect(types).to.include('Debit');
    });

    cy.get('[ng-click="back()"]').click();
    cy.get('#accountSelect').select('1002');
    cy.get('[ng-click="transactions()"]').click();
    cy.get('.table').should('not.contain', '500').and('not.contain', '400');

    cy.get('.logout').click();
    cy.contains('.btn', 'Customer Login').should('be.visible');
    cy.contains('.btn', 'Bank Manager Login').should('be.visible');
  });
});
