/// <reference types='cypress' />
const { faker } = require('@faker-js/faker');
describe('Bank app', () => {
  const depositAmount = `${faker.number.int({ min: 500, max: 1000 })}`;
  const withdrawAmount = `${faker.number.int({ min: 50, max: 500 })}`;
  const balance = depositAmount - withdrawAmount;
  const user = 'Hermoine Granger';
  const accountNumber = '1001';
  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
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

    cy.get('[ng-click="transactions()"]').click();
    cy.get('[ng-click="reset()"]').click();
    cy.get('[ng-click="back()"]').click();

    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type(depositAmount);
    cy.contains('[type="submit"]', 'Deposit').click();

    cy.get('[ng-show="message"]')
      .should('contain', 'Deposit Successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', depositAmount)
      .should('be.visible');

    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw')
      .should('be.visible');
    cy.get('[placeholder="amount"]').type(withdrawAmount);
    cy.contains('[type="submit"]', 'Withdraw').click();

    cy.get('[ng-show="message"]')
      .should('contain', 'Transaction successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balance)
      .should('be.visible');

    cy.get('[ng-click="transactions()"]').click();
    cy.reload();

    cy.get('td')
      .contains(depositAmount)
      .should('be.visible');

    cy.get('td')
      .contains(withdrawAmount)
      .should('be.visible');

    cy.get('[ng-click="back()"]').click();
    cy.get('#accountSelect').select('1002');
    cy.get('[ng-click="transactions()"]').click();
    cy.get('[ng-click="reset()"]').should('not.be.visible');

    cy.get('[ng-click="byebye()"]').click();
    cy.get('[ng-click="byebye()"]').should('not.be.visible');
  });
});
