/// <reference types='cypress' />

const { faker } = require('@faker-js/faker');

describe('Bank app', () => {
  const accountNumber = '1001';
  const startBalance = 5096;
  const randomDeposit = faker.number.int({ min: 1000, max: 9999 });
  const currentBalance = startBalance + randomDeposit;
  const withdrawAmount = faker.number.int({ min: 1000, max: 9999 });
  const balanceAfter = currentBalance - withdrawAmount;

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('button', 'Customer Login').click();
    cy.get('#userSelect').select('Hermoine Granger');
    cy.get('.btn-default').should('be.visible').click();

    cy.contains('.center', 'Account Number')
      .should('contain.text', accountNumber);
    cy.contains('.center', 'Balance').should('contain.text', startBalance);
    cy.contains('.center', 'Currency').should('contain.text', 'Dollar');

    cy.get('[ng-class="btnClass2"]').click();
    cy.get('.form-control').type(randomDeposit);
    cy.get('[type="submit"]').click();
    cy.contains('[ng-show="message"]', 'Deposit Successful')
      .should('be.visible');
    cy.contains('.center', 'Balance').should('contain.text', currentBalance);

    cy.get('[ng-class="btnClass3"]').click();
    cy.contains('[type="submit"]', 'Withdraw').should('be.visible');
    cy.get('[placeholder="amount"]').type(withdrawAmount);
    cy.contains('[type="submit"]', 'Withdraw').click();
    cy.contains('[ng-show="message"]', 'Transaction successful')
      .should('be.visible');
    cy.contains('.center', 'Balance')
      .should('contain.text', balanceAfter);
    cy.reload();

    cy.get('[ng-click="transactions()"]').click();
    cy.get('table', { timeout: 5000 }).should('be.visible');
    cy.get('td.ng-binding').should('contain', withdrawAmount);
    cy.get('td.ng-binding').should('contain', randomDeposit);
    cy.get('[ng-click="back()"]').click();

    cy.get('#accountSelect').select('1001');
    cy.get('[ng-class="btnClass1"]').click();
    cy.get('table').find('tbody').should('not.have.descendants');

    cy.get('.logout').click();
    cy.url().should('include', '/customer');
  });
});
