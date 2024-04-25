/// <reference types='cypress' />

const {
  user,
  accountNumber,
  startBalance,
  currency,
  depositAmount,
  withdrawAmount,
  actualBalance
} = require('../support/bankUser');

describe('Bank app', () => {
  before(() => {
    cy.visit('https://www.globalsqa.com/angularJs-protractor/BankingProject/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.get('button').contains('Customer Login').click();
    cy.get('select').select(user);
    cy.get('button').contains('Login').click();
    cy.get('#accountSelect').select(`${accountNumber}`);
    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', accountNumber)
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', startBalance)
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Currency')
      .contains('strong', currency)
      .should('be.visible');
    cy.get('button').contains('Deposit').click();
    cy.get('[placeholder = "amount"]').type(depositAmount);
    cy.get('[type="submit"]').contains('Deposit').click();
    cy.get('[ng-show="message"]').should('contain', 'Deposit Successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', startBalance + parseInt(depositAmount))
      .should('be.visible');
    cy.get('button').contains('Withdraw').click();
    cy.contains('[type="submit"]', 'Withdraw').should('be.visible');
    cy.get('[placeholder = "amount"]').type(withdrawAmount);
    cy.get('[type="submit"]').contains('Withdraw').click();
    cy.get('[ng-show="message"]').should('contain', 'Transaction successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', actualBalance)
      .should('be.visible');
    cy.get('button').contains('Transactions').click();
    cy.get('td.ng-binding').should('contain', depositAmount);
    cy.get('td.ng-binding').should('contain', withdrawAmount);
    cy.get('button').contains('Back').click();
    cy.get('#accountSelect').select('1003');
    cy.get('button').contains('Transactions').click();
    cy.get('td.ng-binding').should('not.exist');
    cy.get('.logout').click();
    cy.get('#userSelect').should('be.visible');
  });
});
