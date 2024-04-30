const { generateData } = require('./hermioneAccount.spec');
/// <reference types='cypress' />

describe('Bank app', () => {
  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with bank account', () => {
    const {
      depositAmount,
      withdrawAmount,
      balance,
      user,
      accountNumber,
      balanceAfterWithdrow,
      formattedDate,
      startBalance
    } = generateData();

    cy.contains('.btn', 'Customer Login').click();
    cy.get('[name="userSelect"]').select(user);
    cy.contains('.btn', 'Login').click();

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', accountNumber)
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', startBalance)
      .should('be.visible');
    cy.contains('.ng-binding', 'Dollar')
      .should('be.visible');

    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type(depositAmount);
    cy.contains('[type="submit"]', 'Deposit').click();

    cy.get('[ng-show="message"]')
      .should('contain', 'Deposit Successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balance)
      .should('be.visible');

    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw')
      .should('be.visible');
    cy.get('[placeholder="amount"]').type(withdrawAmount);
    cy.contains('[type="submit"]', 'Withdraw').click();

    cy.get('[ng-show="message"]')
      .should('contain', 'Transaction successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balanceAfterWithdrow)
      .should('be.visible');

    cy.get('[ng-click="transactions()"]').click();
    cy.get('#start').type(formattedDate);

    cy.get('td.ng-binding').should('contain', depositAmount);
    cy.get('td.ng-binding').should('contain', 'Credit');
    cy.get('td.ng-binding').should('contain', withdrawAmount);
    cy.get('td.ng-binding').should('contain', 'Debit');

    cy.get('[ng-click="back()"]').click();

    cy.get('#accountSelect').select('1002');

    cy.get('[ng-click="transactions()"]').click();
    cy.get('td.ng-binding').should('not.exist');
    cy.get('.logout').click();
    cy.get('#userSelect').should('contain.text', '---Your Name---');
  });
});
