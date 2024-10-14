/// <reference types='cypress' />

describe('Bank app', () => {
  const userName = 'Hermoine Granger';
  const accountNumber = '1001';
  const balance = '5096';
  const depositValue = '1000';
  const successMessageDeposit = 'Deposit Successful';
  const balanceAfterDeposit = (+balance + +depositValue).toString();
  const withdrawlValue = '200';
  const successMessageWithdrawl = 'Transaction successful';
  // eslint-disable-next-line max-len
  const balanceAfterWithdraw = (+balanceAfterDeposit - +withdrawlValue).toString();
  const anotherAccountNumber = '1002';
  const currency = 'Dollar';

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('#userSelect').select(userName);
    cy.contains('.btn', 'Login').click();
    cy.get('.ng-binding').should('contain', accountNumber);
    cy.get('.ng-binding').should('contain', balance);
    cy.get('.ng-binding').should('contain', currency);

    cy.contains('.btn', 'Deposit').click();
    cy.get('[placeholder="amount"]').type(depositValue);
    cy.get('button[type="submit"]').click();
    cy.get('.error').should('contain', successMessageDeposit);
    cy.get('.ng-binding').should('contain', balanceAfterDeposit);

    cy.contains('.btn', 'Withdrawl').click();
    cy.get('[placeholder="amount"]').type(withdrawlValue);
    cy.get('.form-control').type(withdrawlValue);
    cy.get('button[type="submit"]').click();
    cy.get('.error').should('contain', successMessageWithdrawl);
    cy.get('.ng-binding').should('contain', balanceAfterWithdraw);

    cy.contains('.btn', 'Transactions').click();
    cy.contains('tr', 'Credit').should('be.visible');
    cy.contains('tr', 'Debit').should('be.visible');
    cy.contains('.btn', 'Back').click();

    cy.get('#accountSelect').select(anotherAccountNumber);
    cy.contains('.btn', 'Transactions').click();
    cy.contains('tr', 'Credit').should('not.exist');
    cy.contains('tr', 'Debit').should('not.exist');

    cy.contains('.btn', 'Logout').click();
    cy.get('#userSelect').should('be.visible');
  });
});
