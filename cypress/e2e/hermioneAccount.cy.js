/// <reference types='cypress' />
const { faker } = require('@faker-js/faker');

describe('Bank app', () => {
  const depositAmount = faker.number.int({ min: 500, max: 1000 });
  const withdrawAmount = faker.number.int({ min: 50, max: 500 });
  const user = 'Hermoine Granger';
  const accountNumber = '1001';
  const initialBalance = 5096;
  

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with bank account', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('[name="userSelect"]').select(user);
    cy.contains('.btn', 'Login').click();

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', accountNumber)
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', '0')
      .should('be.visible');
    cy.contains('.ng-binding', 'Dollar')
      .should('be.visible');

    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type(depositAmount);
    cy.contains('[type="submit"]', 'Deposit').click();

    cy.get('[ng-show="message"]')
      .should('contain', 'Deposit Successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', depositAmount + initialBalance)
      .should('be.visible');

    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw')
      .should('be.visible');
    cy.get('[placeholder="amount"]').type(withdrawAmount);
    cy.contains('[type="submit"]', 'Withdraw').click();

    cy.get('[ng-show="message"]')
      .should('contain', 'Transaction successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', depositAmount + initialBalance - withdrawAmount)
      .should('be.visible');

    cy.wait(1000);

    cy.get('[ng-class="btnClass1"]').click();
    cy.get('#start').click();
    cy.get('#start').type('2024-07-30T00:00:00');

    cy.get('#anchor0 > :nth-child(2)')
      .should('contain', depositAmount);

    cy.get('#anchor1 > :nth-child(2)')
      .should('contain', withdrawAmount);

    cy.get('.fixedTopBox > [style="float:left"]').click();
    cy.get('#accountSelect').select('1002');
    cy.get('[ng-class="btnClass1"]').click();
    cy.get('#anchor0 > :nth-child(2)')
      .should('not.exist');
    cy.get('#anchor1 > :nth-child(2)')
      .should('not.exist');

    cy.get('.logout').click();

    cy.url().should('contain', '/customer');
    cy.get('label').should('contain', 'Your Name :');
  });
});
