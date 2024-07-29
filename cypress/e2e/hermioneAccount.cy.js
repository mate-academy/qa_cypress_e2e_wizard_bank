/// <reference types='cypress' />

describe('Bank app', () => {
  const accountNumber = '1001';
  const initialBalance = '5096';
  const currency = 'Dollar';
  const depositAmount = '100';
  const depositSuccessMessage = 'Deposit Successful';
  const postDepositBalance = '5196';
  const withdrawAmount = '50';
  const withdrawSuccessMessage = 'Transaction successful';
  const postWithdrawBalance = '5146';
  const newAccountNumber = '1002';

  before(() => {
    cy.visit('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.get('.borderM > :nth-child(1) > .btn').click();
    cy.get('#userSelect').select('Hermoine Granger');
    cy.get('form.ng-valid > .btn').click();
    cy.get('.borderM > :nth-child(3)').should('contain', accountNumber);
    cy.get('.borderM > :nth-child(3)').should('contain', initialBalance);
    cy.get('.borderM > :nth-child(3)').should('contain', currency);
    cy.get('[ng-class="btnClass2"]').click();
    cy.get('.form-control').type(depositAmount);
    cy.get('form.ng-dirty > .btn').click();
    cy.get('.error').should('contain', depositSuccessMessage);
    cy.get('.borderM > :nth-child(3)').should('contain', postDepositBalance);
    cy.get('[ng-class="btnClass3"]').click();
    cy.wait(1000);
    cy.get('.form-control').type(withdrawAmount);
    cy.get('form.ng-dirty > .btn').click();
    cy.get('.error').should('contain', withdrawSuccessMessage);
    cy.get('.borderM > :nth-child(3)').should('contain', postWithdrawBalance);
    cy.wait(1000);
    cy.get('[ng-class="btnClass1"]').click();
    cy.get('#start').type('2024-07-29T00:00');
    cy.get('#anchor0 > :nth-child(2)').should('contain', depositAmount);
    cy.get('#anchor0 > :nth-child(3)').should('contain', 'Credit');
    cy.get('#anchor1 > :nth-child(2)').should('contain', withdrawAmount);
    cy.get('#anchor1 > :nth-child(3)').should('contain', 'Debit');
    cy.get('.fixedTopBox > [style="float:left"]').click();
    cy.get('#accountSelect').select(newAccountNumber);
    cy.get('[ng-class="btnClass1"]').click();
    cy.get('[style="float:right;margin-top:-30px;"]').should('not.be.visible');
    cy.get('.logout').click();
    cy.get('#userSelect').should('contain', 'Your Name');
  });
});
