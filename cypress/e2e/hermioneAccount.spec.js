/// <reference types='cypress' />
const { faker } = require('@faker-js/faker');

describe('Bank app', () => {
  const accountNumber = '1001';
  const anotherAccountNumber = '1003';
  const initialBalance = 5096;
  const depositAmount = faker.datatype.number({ min: 1, max: 5000 });
  const withdrawlAmount = faker.datatype.number({ min: 1, max: 5000 });
  const withdrawlAmountString = withdrawlAmount.toString();
  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.get('.btn').contains('Customer Login').click();
    cy.get('#userSelect').select('Hermoine Granger');
    cy.get('.btn').contains('Login').should('be.visible').click();
    cy.get('div.center')
      .invoke('text')
      .should('include', `Account Number : ${accountNumber}`);
    cy.get('div.center')
      .invoke('text')
      .should('include', 'Balance : ');
    cy.get('div.center')
      .invoke('text')
      .should('include', 'Currency : Dollar');
    cy.get('button[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type(depositAmount);
    cy.get('.btn.btn-default').contains('Deposit').click();
    cy.get('.error')
      .should('be.visible')
      .and('contain', 'Deposit Successful');
    const expectedBalance = initialBalance + depositAmount;
    cy.get('div.center')
      .invoke('text')
      .should('include', `Balance : ${expectedBalance}`);
    cy.get('button[ng-click="withdrawl()"]').click();
    cy.get('input[placeholder="amount"]').as('amountInput');
    cy.get('@amountInput').should('exist').and('not.be.disabled');
    cy.wait(1000);
    cy.get('@amountInput').type(withdrawlAmountString);
    cy.get('@amountInput').should('have.value', withdrawlAmountString);
    cy.get('.btn.btn-default').contains('Withdraw').click();
    cy.get('.error')
      .should('be.visible')
      .and('contain', 'Transaction successful');
    const expectedBalanceAfterWithdrawl = expectedBalance - withdrawlAmount;
    cy.get('div.center')
      .invoke('text')
      .should('include', `Balance : ${expectedBalanceAfterWithdrawl}`);
    cy.contains('.btn', 'Transactions').click();
    cy.wait(1000);
    cy.contains('tr', 'Credit').should('exist');
    cy.contains('td', 'Credit').should('be.visible');
    cy.contains('tr', 'Debit').should('exist');
    cy.contains('td', 'Debit').should('be.visible');
    cy.contains('.btn', 'Back').click();
    cy.get('#accountSelect').select(anotherAccountNumber);
    cy.contains('.btn', 'Transactions').click();
    cy.contains('tr', 'Credit').should('not.exist');
    cy.contains('tr', 'Debit').should('not.exist');
    cy.contains('.btn', 'Logout').click();
    cy.get('#userSelect').should('be.visible');
  });
});
