/* eslint-disable max-len */
/// <reference types='cypress' />

describe('Bank app', () => {
  const user = 'Hermoine Granger';
  const accNumber = '1001';
  const startingBalance = 5096;
  const currency = 'Dollar';
  const deposit = 150;
  const balanceAfterDep = startingBalance + deposit;
  const withdraw = 200;
  const balanceAfterWithd = balanceAfterDep - withdraw;

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.get('.btn').contains('Customer Login').should('exist').click();

    cy.get('#userSelect').select(user);

    cy.get('.btn-default').contains('Login').should('exist').click();

    cy.get('#accountSelect').should('exist').select(accNumber);

    cy.get('.borderM > :nth-child(3) > :nth-child(2)').should('contain', startingBalance);

    cy.get('.ng-binding').should('contain', currency).should('be.visible');

    cy.get('.btn').contains('Deposit').should('exist').click();

    cy.findByPlaceholder('amount').type(deposit);

    cy.get('[type="submit"]').contains('Deposit').should('exist').click();

    cy.get('.error').contains('Deposit Successful').should('be.visible');

    cy.contains('[ng-hide="noAccount"]', 'Balance').should('contain', balanceAfterDep).should('be.visible');

    cy.get('.btn').contains('Withdrawl').should('exist').click();

    cy.findByPlaceholder('amount').type(withdraw);
    cy.findByPlaceholder('amount').type(withdraw); // it works if only i dublicate this step

    cy.get('[type="submit"]').contains('Withdraw').should('exist').click();

    cy.get('.error').contains('Transaction successful').should('be.visible');

    cy.contains('[ng-hide="noAccount"]', 'Balance').should('contain', balanceAfterWithd).should('be.visible');

    cy.get('.btn').contains('Transactions').should('exist').click();

    cy.get('td.ng-binding').should('contain', deposit);
    cy.get('td.ng-binding').should('contain', withdraw);

    cy.get('.btn').contains('Back').should('exist').click();

    cy.get('#accountSelect').should('contain', '1003').select('1003');

    cy.get('.btn').contains('Transactions').should('exist').click();

    cy.get('td.ng-binding').should('not.exist');

    cy.get('.btn').contains('Logout').should('exist').click();

    cy.get('#userSelect').contains('---Your Name---').should('exist');
  });
});
