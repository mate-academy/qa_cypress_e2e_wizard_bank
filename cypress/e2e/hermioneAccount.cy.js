/* eslint-disable max-len */
/// <reference types='cypress' />

describe('Bank app', () => {
  before(() => {
    cy.visit('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login');
  });

  const fullName = 'Hermoine Granger';
  const assertAccountNumber = '1001';
  const newassertAccountNumber = '1003';
  const balance = '0';
  const currency = 'Dollar';
  const amountToBeDeposited = '1500';
  const balanceAfterDeposit = +balance + +amountToBeDeposited;
  const depositSuccesMessage = 'Deposit Successful';
  const amountToBeWithdrawl = '750';
  const balanceAfterWithdrawl = +balanceAfterDeposit - +amountToBeWithdrawl;
  const withdrawlSuccesMessage = 'Transaction successful';

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('#userSelect').select(fullName);
    cy.contains('.btn', 'Login').click();
    cy.get('#accountSelect').should('contain', assertAccountNumber);

    cy.contains('.btn', 'Transactions').click();
    cy.contains('.btn', 'Reset').click();
    cy.contains('.btn', 'Back').click();

    cy.get('.borderM > :nth-child(3) > :nth-child(2)').should('contain', balance);
    cy.get('.borderM > :nth-child(3) > :nth-child(3)').should('contain', currency);

    cy.contains('.btn', 'Deposit').click();
    cy.get('.form-control').type(`${amountToBeDeposited}{enter}`);
    cy.contains('.error', depositSuccesMessage).should('be.visible');
    cy.get('.borderM > :nth-child(3) > :nth-child(2)').should('contain', balanceAfterDeposit);

    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw')
      .should('be.visible');
    cy.get('[placeholder="amount"]').type(amountToBeWithdrawl);
    cy.contains('[type="submit"]', 'Withdraw').click();
    cy.contains('.error', withdrawlSuccesMessage).should('be.visible');
    cy.get('.borderM > :nth-child(3) > :nth-child(2)').should('contain', balanceAfterWithdrawl);

    cy.reload();

    cy.contains('.btn', 'Transactions ').click();
    cy.contains('tr', 'Credit').should('contain', amountToBeDeposited);
    cy.contains('tr', 'Debit').should('contain', amountToBeWithdrawl);

    cy.contains('.btn', 'Back').click();
    cy.get('#accountSelect').select(newassertAccountNumber);
    cy.contains('.btn', 'Transactions ').click();
    cy.contains('tr', 'Credit').should('not.exist');
    cy.contains('tr', 'Debit').should('not.exist');

    cy.get('.logout').click();
    cy.get('#userSelect').should('be.visible');
  });
});
