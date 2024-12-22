/// <reference types='cypress' />

describe('Bank app', () => {
  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('button', 'Customer Login').click();
    cy.get('#userSelect').select('Hermoine Granger');
    cy.get('.btn-default').should('be.visible').click();

    cy.contains('.center', 'Account Number')
      .should('contain.text', 1001);
    cy.contains('.center', 'Balance').should('contain.text', 5096);
    cy.contains('.center', 'Currency').should('contain.text', 'Dollar');

    cy.get('[ng-class="btnClass2"]').click();
    cy.get('.form-control').type(1234);
    cy.get('[type="submit"]').click();
    cy.contains('[ng-show="message"]', 'Deposit Successful')
      .should('be.visible');
    cy.contains('.center', 'Balance').should('contain.text', 6330);

    cy.get('[ng-class="btnClass3"]').click();
    cy.contains('[type="submit"]', 'Withdraw').should('be.visible');
    cy.get('[placeholder="amount"]').type(123);
    cy.contains('[type="submit"]', 'Withdraw').click();
    cy.contains('[ng-show="message"]', 'Transaction successful')
      .should('be.visible');
    cy.contains('.center', 'Balance')
      .should('contain.text', 6207);
    cy.reload();

    cy.get('[ng-click="transactions()"]').click();
    // cy.get('table').should('be.visible');
    cy.get('td.ng-binding').should('contain', 123);
    cy.get('td.ng-binding').should('contain', 123);
    cy.get('[ng-click="back()"]').click();

    cy.get('.logout').click();
    cy.url().should('include', '/customer');
  });
});
