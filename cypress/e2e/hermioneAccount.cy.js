/// <reference types='cypress' />

describe('Bank app', () => {
  before(() => {
    cy.visit('/');
  });

  // eslint-disable-next-line max-len
  it('should allow managing Hermione\'s bank account and verify account isolation', () => {
    cy.contains('button', 'Customer Login').click();
    cy.get('#userSelect').select('Hermoine Granger');
    cy.get('.btn-default').click();

    cy.contains('.center', 'Account Number').should('contain.text', '1001');
    cy.contains('.center', 'Balance').should('contain.text', 5096);
    cy.contains('.center', 'Currency').should('contain.text', 'Dollar');

    cy.get('[ng-click="deposit()"]').click();
    cy.get('[ng-model="amount"]').type(500);
    cy.get('form.ng-dirty > .btn').click();
    cy.contains('.error', 'Deposit Successful').should('be.visible');
    cy.contains('.center', 'Balance').should('contain.text', 5596);

    cy.get('[ng-click="withdrawl()"]').click();
    cy.get('[placeholder="amount"]').type(200);
    cy.contains('[type="submit"]', 'Withdraw').click();
    // eslint-disable-next-line max-len
    cy.contains('[ng-show="message"]', 'Transaction successful').should('be.visible');
    cy.contains('.center', 'Balance').should('contain.text', 5396);

    cy.get('[ng-click="transactions()"]').click();
    cy.get('tbody tr').eq(0).find('td').eq(1).should('contain.text', '500');
    cy.get('tbody tr').eq(1).find('td').eq(1).should('contain.text', '200');
    cy.get('[ng-click="back()"]').click();

    cy.get('#accountSelect').select('1002');
    cy.get('[ng-click="transactions()"]').click();
    cy.get('tbody tr').should('have.length', 0);
    cy.get('[ng-click="back()"]').click();

    cy.get('.logout').click();
    cy.contains('button', 'Customer Login').should('be.visible');
  });
});
