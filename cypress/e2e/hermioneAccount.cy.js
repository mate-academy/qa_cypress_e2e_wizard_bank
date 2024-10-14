/// <reference types='cypress' />

describe('Bank app', () => {
  const name = 'Hermoine Granger';
  const accountNumber = '1001';
  const anotherAccount = '1002';
  const defaultBalance = '5096';
  const currency = 'Dollar';
  const depositAmount = '200';
  const successMessageDeposit = 'Deposit Successful';
  const newBalance = +depositAmount + +defaultBalance;
  const newBalanceString = newBalance.toString();
  const withdrawAmount = '100';
  const successMessageWithdawl = 'Transaction successful';
  const balance = +newBalance - +withdrawAmount;
  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('#userSelect').select(name);
    cy.get('[type="submit"]').click();
    cy.get('#accountSelect').should('contain', accountNumber);
    cy.contains('.ng-binding', defaultBalance).should('be.visible');
    cy.contains('.ng-binding', currency).should('be.visible');
    cy.contains('.btn', 'Deposit ').click();
    cy.get('[placeholder="amount"]').type(`${depositAmount}{enter}`);
    cy.contains('.error', successMessageDeposit).should('be.visible');
    cy.contains('.ng-binding', newBalanceString).should('be.visible');
    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw').should('be.visible');
    cy.get('[placeholder="amount"]').type(withdrawAmount);
    cy.get('[type="submit"]').click();
    cy.contains('.error', successMessageWithdawl).should('be.visible');
    cy.contains('.ng-binding', balance).should('be.visible');
    cy.contains('.btn', 'Transactions ').click();
    cy.contains('tr', 'Credit').should('contain', depositAmount);
    cy.contains('tr', 'Debit').should('contain', withdrawAmount);
    cy.contains('.btn', 'Back').click();
    cy.get('#accountSelect').select(anotherAccount);
    cy.contains('.btn', 'Transactions ').click();
    cy.contains('tr', 'Credit').should('not.exist');
    cy.contains('tr', 'Debit').should('not.exist');
    cy.get('.logout').click();
    cy.get('#userSelect').should('be.visible');
  });
});
