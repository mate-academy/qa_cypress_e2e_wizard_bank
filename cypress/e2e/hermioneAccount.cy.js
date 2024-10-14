/// <reference types='cypress' />

describe('Bank app', () => {
  const fullName = 'Hermoine Granger';
  const accountNumber = '1001';
  const startingBalance = '5096';
  const currency = 'Dollar';
  const depositAmount = '200';
  const withdrawAmount = '100';
  const anotherAccount = '1002';

  const newBalance = (+startingBalance + +depositAmount).toString();
  const balance = (+newBalance - +withdrawAmount).toString();

  const depositSuccessMessage = 'Deposit Successful';
  const withdrawSuccessMessage = 'Transaction successful';
  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('#userSelect').select(fullName);
    cy.get('[type="submit"]').click();
    cy.get('#accountSelect').should('contain', accountNumber);
    cy.contains('.btn', 'Transactions ').click();

    cy.contains('.ng-binding', startingBalance).should('be.visible');
    cy.contains('.ng-binding', currency).should('be.visible');
    cy.contains('.btn', 'Deposit ').click();

    cy.get('[placeholder="amount"]').type(`${depositAmount}{enter}`);
    cy.contains('.error', depositSuccessMessage).should('be.visible');

    cy.contains('.ng-binding', newBalance).should('be.visible');
    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw').should('be.visible');
    cy.get('[placeholder="amount"]').type(withdrawAmount);
    cy.contains('[type="submit"]', 'Withdraw').should('be.visible');
    cy.get('[type="submit"]').click();
    cy.contains('.error', withdrawSuccessMessage).should('be.visible');

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
