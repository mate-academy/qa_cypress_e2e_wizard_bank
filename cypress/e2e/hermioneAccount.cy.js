import { faker } from '@faker-js/faker'

/// <reference types='cypress' />

describe('Bank app', () => {
  const customerLoginBtn = 'Customer Login';
  const user = 'Hermoine Granger';
  const depositBtn = 'Deposit';
  const depositSuccessMesage = 'Deposit Successful';
  const withdrawlBtn = 'Withdrawl';
  const withdrawlSuccessMesage = 'Transaction successful';
  const withdrawBtn = 'Withdraw';
  const transactionsBtn = 'Transactions';
  const backBtn = 'Back';
  const logoutBtn = 'Logout';

  before(() => {
    cy.visit('https://globalsqa.com/angularJs-protractor/BankingProject/#/login');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {

    cy.contains('.btn', customerLoginBtn).click();
    cy.url().should('contain', 'customer');
    cy.get('#userSelect').select(user);
    cy.get('[type="submit"]').click();
    cy.get('.fontBig').should('contain', user)

    cy.contains('Account Number').next().should('exist');
    cy.contains('Balance').next().should('exist');
    cy.contains('Currency').next().should('exist');

    cy.contains('.btn', depositBtn).click();
    cy.get('[placeholder="amount"]').type('10');
    cy.contains('.btn-default', depositBtn).click();
    cy.contains('.error', depositSuccessMesage).should('be.visible');
    cy.contains('Balance').should('contain', '100');

    cy.reload();

    cy.contains('.btn', withdrawlBtn).click();
    cy.get('[placeholder="amount"]').type('50');
    cy.contains('.btn-default', withdrawBtn).click();
    cy.contains('.error', withdrawlSuccessMesage).should('be.visible');
    cy.contains('Balance').should('contain', '50');

    cy.contains('.btn', transactionsBtn).click();
    cy.contains('Deposit').should('exist');
    cy.contains('Withdraw').should('exist');

    cy.contains('.btn', backBtn).click();

    cy.get('#accountSelect').select('1002');

    cy.contains('.btn', transactionsBtn).click();

    cy.contains('.btn', logoutBtn).click();

  });
});
