/// <reference types='cypress' />

describe('Bank app', () => {
  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('#userSelect').select('Hermoine Granger');
    cy.contains('.btn', 'Login').click();

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', '1001')
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', '0')
      .should('be.visible');
    cy.contains('.ng-binding', 'Dollar').should('be.visible');

    cy.get('[ng-click="transactions()"]').click();
    cy.get('[ng-click="reset()"]').click();
    cy.get('[ng-click="back()"]').click();

    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type('500');
    cy.contains('[type="submit"]', 'Deposit').click();

    cy.get('[ng-show="message"]').should('contain', 'Deposit Successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', '500')
      .should('be.visible');

    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw').should('be.visible');
    cy.get('[placeholder="amount"]').type('400');
    cy.contains('[type="submit"]', 'Withdraw').click();

    cy.get('[ng-show="message"]').should('contain', 'Transaction successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', '100')
      .should('be.visible');
    cy.reload();

    cy.get('[ng-class="btnClass1"]').click();
    cy.get('td.ng-binding').should('contain', 500);
    cy.get('td.ng-binding').should('contain', 400);
    cy.get('[ng-click="back()"]').click();

    cy.get('#accountSelect').select('1002');
    cy.get('[ng-click="transactions()"]').click();
    cy.get('.table').should('not.contain', 500);
    cy.get('.table').should('not.contain', 400);

    cy.get('.logout').click();
    cy.url().should('include', '/customer');
  });
});
