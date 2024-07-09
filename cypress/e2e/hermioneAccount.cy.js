/// <reference types='cypress' />

const { accountData } = require('../support/accountData');

describe('Bank app', () => {
  const accountInfo = accountData();

  before(() => {
    cy.visit('/#/login');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.login(accountInfo);

    cy.assertAccountInfo(accountInfo);

    cy.transactionOperations(accountInfo)
      .then(({ depositTime, withdrawTime }) => {
        cy.transactionDetails(accountInfo, depositTime, withdrawTime);
      });

    cy.get('[ng-click="back()"]').click();

    cy.noTransactionAccount(accountInfo);

    cy.contains('button', 'Logout').click();
    cy.url().should('include', '#/customer');
  });
});
