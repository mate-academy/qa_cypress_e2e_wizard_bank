/// <reference types='cypress' />

describe('Bank app', () => {
  beforeEach(() => {
    cy.visit(
      'https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login'
    );
  });

  it(`should provide the ability to work with Hermione's bank account`, () => {
    cy.contains('.btn', 'Customer Login').click();

    cy.get('#userSelect').select('Hermoine Granger');

    cy.contains('.btn', 'Login').click();

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', '1001')
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', '0')
      .should('be.visible');
    cy.contains('.ng-binding', 'Dollar')
      .should('be.visible');

    cy.get('.borderM > :nth-child(3) > :nth-child(2)')
      .invoke('text')
      .then(Number)
      .as('initialBalance');

    cy.get('@initialBalance').then((initialBalance) => {
      cy.get('[ng-click="deposit()"]').click();
      cy.get('label').should('contain.text', 'Deposited');

      cy.get('[name=myForm]').within(() => {
        cy.get('[placeholder=amount]').type('200');
        cy.get('[type=submit]').click();
      });

      cy.contains('Deposit Successful').should('exist');

      cy.get('.borderM > :nth-child(3) > :nth-child(2)')
        .invoke('text')
        .should('eq', String(initialBalance + 200));

      cy.get('[ng-click="withdrawl()"]').click();
      cy.get('label').should('contain.text', 'Withdrawn');

      cy.get('[name=myForm]').within(() => {
        cy.get('[placeholder=amount]').type('25');
        cy.get('[type=submit]').click();
      });

      cy.contains('Transaction successful').should('exist');

      cy.get('.borderM > :nth-child(3) > :nth-child(2)')
        .invoke('text')
        .should('eq', String(initialBalance + 200 - 25));

      cy.get('[ng-click="transactions()"]').click();
    });

    cy.url().should('include', 'listTx');
    cy.get('tbody tr').should('have.length.above', 0);
    cy.get('tbody').should('contain', '200').and('contain', '25');

    cy.contains('.btn', 'Back').click();

    cy.get('#accountSelect').select('1002');

    cy.get('[ng-click="transactions()"]').click();
    cy.url().should('include', 'listTx');
    cy.get('tbody tr').should('have.length', 0);

    cy.get('[ng-show="logout"]').click();

    cy.get('#userSelect').should('exist');
  });
});
