/// <reference types='cypress' />

describe('Bank app', () => {
  const accountNumber = '1001';
  const depositAmount = 20;
  const withdrawAmount = 30;
  let balance = 5096;
  const date = '2024-04-25T00:00';
  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.get('.btn').contains('Customer Login')
      .click();
    cy.get('.form-control')
      .select(['Hermoine Granger']);
    cy.get('form.ng-valid > .btn')
      .click();
    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', accountNumber)
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balance)
      .should('be.visible');
    cy.contains('.ng-binding', 'Dollar')
      .should('be.visible');
    cy.get('.btn').contains('Deposit')
      .click();
    cy.get('.form-control')
      .type(depositAmount);
    cy.get('.btn-default').contains('Deposit')
      .click();
    cy.get('[ng-show="message"]')
      .should('contain', 'Deposit Successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balance = balance + depositAmount)
      .should('be.visible');
    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw')
      .should('be.visible');
    cy.get('.form-control').type(withdrawAmount);
    cy.contains('[type="submit"]', 'Withdraw').click();
    cy.get('[ng-show="message"]')
      .should('contain', 'Transaction successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balance = balance - withdrawAmount)
      .should('be.visible');
    cy.get('.btn').contains('Transactions')
      .click();
    cy.get('#start')
      .type(date);
    cy.get('#anchor0')
      .should('contain.text', depositAmount);
    cy.get('#anchor0')
      .should('contain.text', 'Credit');
    cy.get('#anchor1')
      .should('contain.text', withdrawAmount);
    cy.get('#anchor1')
      .should('contain.text', 'Debit');
    cy.get('.btn').contains('Back')
      .click();
    cy.get('#accountSelect')
      .select('number:1002');
    cy.get('[ng-class="btnClass1"]')
      .click();
    cy.get('#anchor0')
      .should('not.exist');
    cy.get('.logout')
      .click();
    cy.url()
      .should('include', 'customer');
  });
});
