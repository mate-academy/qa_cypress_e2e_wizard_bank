/// <reference types='cypress' />

describe('Bank app', () => {
  const balance = '5096';
  const amountDeposit = '100';
  const amountWithdraw = '200';

  const user = 'Hermoine Granger';
  const accountNumber = '1001';
  const anotherAccountNumber = '1003';
  const currency = 'Dollar';

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('#userSelect').select(user);
    cy.get('[type="submit"]').click();

    cy.get('#accountSelect').contains(accountNumber).should('be.visible');
    cy.get('.ng-binding:nth-of-type(1)').contains(accountNumber);
    cy.get('.ng-binding:nth-of-type(2)').contains(balance);
    cy.get('.ng-binding:nth-of-type(3)').contains(currency);

    cy.contains('.btn', 'Deposit').click();
    cy.get('[placeholder="amount"]').type(amountDeposit);
    cy.contains('[type="submit"]', 'Deposit').click();
    cy.get('.error').should('contain', 'Deposit Successful');
    cy.get('.ng-binding:nth-of-type(2)')
      .should('contain', (+balance + +amountDeposit).toString());

    cy.contains('.btn', 'Withdrawl').click();
    cy.get('[placeholder="amount"]').type(amountWithdraw);
    cy.get('[type="submit"]').click();
    cy.get('.error').should('contain', 'Transaction successful');
    cy.get('.ng-binding:nth-of-type(2)')
      .should('contain', (+balance - +amountWithdraw).toString());

    cy.contains('.btn', 'Transactions ').click();
    cy.contains('tr', 'Credit').should('contain', amountDeposit);
    cy.contains('tr', 'Debit').should('contain', amountWithdraw);
    cy.contains('.btn', 'Back').click();
    cy.get('#accountSelect').select(anotherAccountNumber);

    cy.contains('.btn', 'Transactions ').click();
    cy.contains('tr', 'Credit').should('not.exist');
    cy.contains('tr', 'Debit').should('not.exist');
  });
});
