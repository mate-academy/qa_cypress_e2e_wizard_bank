/* eslint-disable cypress/unsafe-to-chain-command */
/// <reference types='cypress' />

describe('Bank app', () => {
  let balance = 0;

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.get('.center:first-child').click();
    cy.get('#userSelect').select('Hermoine Granger');
    cy.get('.btn.btn-default').click();
    cy.get('#accountSelect').select('1001');

    cy.get('[ng-hide=noAccount] .ng-binding:nth-child(3)')
      .invoke('text')
      .should('eq', 'Dollar');

    cy.get('[ng-hide=noAccount] .ng-binding:nth-child(2)')
      .invoke('text')
      .then((balanceText) => {
        balance = Number(balanceText);

        cy.get('[ng-class=btnClass2]').click();
        cy.get('[ng-model=amount]').type('50');
        cy.get('.form-group + .btn').click();
        cy.contains('span', 'Deposit Successful');

        cy.get('[ng-hide=noAccount] .ng-binding:nth-child(2)')
          .invoke('text')
          .should('eq', String(balance + 50));

        cy.get('[ng-class=btnClass3]').click();
        cy.get('[ng-model=amount]').clear();
        cy.get('[ng-model=amount]').type('50');
        cy.get('.form-group + .btn').click();
        cy.contains('span', 'Transaction successful');

        cy.get('[ng-hide=noAccount] .ng-binding:nth-child(2)')
          .invoke('text')
          .should('eq', String(balance));
      });

    const now = new Date();
    const start = new Date(now);
    start.setHours(14, 0, 0, 0);
    const formatDateTime = (date) => date.toISOString().slice(0, 16);
    cy.get('[ng-class=btnClass1]').click();

    cy.get('#start').clear().type(formatDateTime(start));

    cy.get('tbody tr').should('exist');

    cy.get('tbody tr').should('have.length', 2);
    cy.get('tbody tr')
      .eq(0)
      .within(() => {
        cy.get('td').eq(1).should('contain.text', 'Credit');
        cy.get('td').eq(2).should('contain.text', '50');
      });

    cy.get('tbody tr')
      .eq(1)
      .within(() => {
        cy.get('td').eq(1).should('contain.text', 'Debit');
        cy.get('td').eq(2).should('contain.text', '50');
      });

    cy.get('.fixedTopBox .btn:first-child').click();

    cy.get('#accountSelect').select('1002');
    cy.get('[ng-class=btnClass1]').click();
    cy.get('tbody tr').should('not.exist');

    cy.get('.btn.logout').click();
    cy.contains('label', 'Your Name :');
  });
});
