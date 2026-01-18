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

    cy.get('[ng-hide=noAccount] .ng-binding:nth-child(2)')
      .invoke('text')
      .then((balanceText) => {
        balance = Number(balanceText);

        cy.get('[ng-class=btnClass2]').click();
        cy.get('[ng-model=amount]').type('50');
        cy.get('.form-group + .btn').click();
        cy.get('.error.ng-binding').should('be.visible');

        cy.get('[ng-hide=noAccount] .ng-binding:nth-child(2)')
          .invoke('text')
          .should('eq', String(balance + 50));

        cy.get('[ng-class=btnClass3]').click();
        cy.get('[ng-model=amount]').clear();
        cy.get('[ng-model=amount]').type('50');
        cy.get('.form-group + .btn').click();
        cy.get('.error.ng-binding').should('be.visible');

        cy.get('[ng-hide=noAccount] .ng-binding:nth-child(2)')
          .invoke('text')
          .should('eq', String(balance));
      });

    cy.get('[ng-class=btnClass1]').click();
    cy.get('#start').invoke('show');
    cy.get('.fixedTopBox .btn:first-child').click();

    cy.get('#accountSelect').select('1002');
    cy.get('[ng-class=btnClass1').click();
    cy.get('tbody tr').should('not.exist');

    cy.get('.btn.logout').click();
    cy.contains('label', 'Your Name :');
  });
});
