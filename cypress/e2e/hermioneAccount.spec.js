/// <reference types='cypress' />
const { faker } = require('@faker-js/faker');

describe('Hermione Account Flow.', () => {
  const depositAmount = Math.floor(Math.random() * 500 + 100);
  const withdrawAmount = Math.floor(depositAmount / 2);

  before(() => {
    cy.visit('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login');
  });

  it('Logs in as Hermione Granger and performs deposit and withdrawal.', () => {
    cy.contains('Customer Login').click();
    cy.get('#userSelect').select('Hermoine Granger');
    cy.get('button[type="submit"]').click();

    cy.get('.borderM strong').eq(0).invoke('text').should('match', /^\d{4}$/);
    cy.get('.borderM strong').eq(1).invoke('text').as('initialBalance');
    cy.get('.borderM strong').eq(2).should('contain.text', 'Dollar');

    cy.contains('Deposit').click();
    cy.get('input[ng-model="amount"]').type(depositAmount);
    cy.get('form[name="myForm"] button').click();
    cy.get('.error').should('contain.text', 'Deposit Successful');

    cy.get('.borderM strong').eq(1).invoke('text').then((balanceAfterDeposit) => {
      cy.get('@initialBalance').then((initial) => {
        const expected = parseInt(initial) + depositAmount;
        expect(parseInt(balanceAfterDeposit)).to.eq(expected);
      });
    });

    cy.contains('Withdrawl').click();
    cy.get('input[ng-model="amount"]').type(withdrawAmount);
    cy.get('form[name="myForm"] button').click();
    cy.get('.error').should('contain.text', 'Transaction successful');

    cy.get('.borderM strong').eq(1).invoke('text').then((balanceAfterWithdraw) => {
      cy.get('@initialBalance').then((initial) => {
        const expected = parseInt(initial) + depositAmount - withdrawAmount;
        expect(parseInt(balanceAfterWithdraw)).to.eq(expected);
      });
    });

    cy.contains('Transactions').click();
    cy.get('table tbody tr').should('have.length.at.least', 2);
    cy.contains('Back').click();

    cy.get('#accountSelect option').then(($options) => {
      const accounts = [...$options];
      const second = accounts.find((opt) => !opt.selected);
      if (second) {
        cy.get('#accountSelect').select(second.label);
        cy.contains('Transactions').click();
        cy.contains('No Transactions Found').should('exist');
        cy.contains('Back').click();
      }
    });

    cy.contains('Logout').click();
    cy.get('#userSelect').should('be.visible');
  });
});