/// <reference types='cypress' />

describe('Bank app', () => {
  before(() => {
    cy.visit('/#/login ');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    const start = new Date().toISOString().slice(0, 19);

    cy.contains('button', 'Customer Login').click();
    cy.get('#userSelect').select(1);
    cy.get('button[type="submit"]').click();
    cy.contains('[ng-hide="noAccount"]', 'Account Number').contains('1001');
    cy.contains('[ng-hide="noAccount"]', 'Balance').should('exist');
    cy.contains('[ng-hide="noAccount"]', 'Currency').should('exist');
    cy.contains('button', 'Deposit').click();
    cy.get('input[placeholder="amount"]').type('2000');
    cy.get('button[type="submit"]').click();
    cy.contains('span', 'Deposit Successful').should('exist');
    cy.contains('[ng-hide="noAccount"]', 'Balance').should('contain', '7096');
    cy.contains('button', 'Withdrawl').click();
    cy.get('input[placeholder="amount"]').type('2000');
    cy.get('input[placeholder="amount"]').type('1000');
    cy.get('button[type="submit"]').click();
    cy.contains('span', 'Transaction successful').should('exist');
    cy.contains('[ng-hide="noAccount"]', 'Balance').should('contain', '6096');
    cy.contains('button', 'Transactions').click();
    cy.get('#start').type(`${start}`);
    cy.contains('td', '1000').should('exist');
    cy.contains('td', '2000').should('exist');
    cy.contains('td', 'Credit').should('exist');
    cy.contains('td', 'Debit').should('exist');
    cy.contains('button', 'Back').click();
    cy.get('#accountSelect').select('number:1002');
    cy.contains('button', 'Transactions').click();
    cy.get('tbody').should('not.contain.html');
    cy.contains('button[ng-show="logout"]', 'Logout').click();

    cy.location('hash').should('include', 'customer');
  });
});
