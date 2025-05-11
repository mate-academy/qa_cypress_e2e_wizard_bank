/// <reference types='cypress' />

describe("Bank app", () => {
  before(() => {
    cy.visit("/");
  });

  it("should provide the ability to work with Hermione's bank account", () => {
    cy.get('button[ng-click="customer()"]').click();
    cy.get('[name="userSelect"]').select('Hermoine Granger');
    cy.get('button.btn.btn-default[type="submit"]').click();

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .should('contain', '1001');
      
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .should('contain', '5096');

    cy.contains('[ng-hide="noAccount"]', 'Currency')
      .should('contain', 'Dollar');

    cy.get('button[ng-click="deposit()"]').click();
    cy.get('form[ng-submit="deposit()"] input[ng-model="amount"]').type('1000');
    cy.get('form.ng-dirty > .btn').click();
    cy.contains('span', 'Deposit Successful')
      .should('be.visible');

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .should('contain', '6096');

    cy.get('button[ng-click="withdrawl()"]').click();
    cy.get('form[ng-submit="withdrawl()"] input[ng-model="amount"]').type('100');
    cy.get('form.ng-dirty > .btn').click();
    cy.contains('span', 'Transaction successful')

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .should('contain', '5996');
    cy.get('button[ng-click="transactions()"]').click();
    cy.get('table tbody tr').should('have.length', 0);

    cy.get('.logout').click();
    cy.url().should('include', '/customer');




  });
  
});
