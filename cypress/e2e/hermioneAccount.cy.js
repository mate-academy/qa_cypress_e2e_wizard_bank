/// <reference types='cypress' />
import { faker } from '@faker-js/faker';

describe('Bank app', () => {
  const user = 'Hermoine Granger';
  const accountNumber = '1001';
  const basicBalance = 5096;
  const currency = 'Dollar';
  const depositValue = `${faker.number.int({ min: 20, max: 10000 })}`;
  const currentBalance = Number(depositValue) + basicBalance;
  const withdrawValue = `${faker.number.int({ min: 50, max: 1000 })}`;
  const balance = currentBalance - withdrawValue;

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
      .contains('strong', basicBalance)
      .should('be.visible');
    cy.contains('.ng-binding', currency)
      .should('be.visible');

    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type(depositValue);
    cy.contains('[type="submit"]', 'Deposit').click();

    cy.get('[ng-show="message"]')
      .should('contain', 'Deposit Successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', currentBalance)
      .should('be.visible');

    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw')
      .should('be.visible');
    cy.get('.form-control').type(withdrawValue);
    cy.contains('[type="submit"]', 'Withdraw').click();

    cy.get('[ng-show="message"]')
      .should('contain', 'Transaction successful');

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balance)
      .should('be.visible');

    cy.get('[ng-class="btnClass1"]').click();
    cy.url().should('include', '#/listTx');
    cy.get('#start').type('2024-05-01T08:30');
    cy.get('td.ng-binding').should('contain', depositValue);
    cy.get(':nth-child(2)').should('contain', withdrawValue);

    cy.contains('[ng-click="back()"]', 'Back').click();

    cy.get('#accountSelect').select('1002');

    cy.get('[ng-class="btnClass1"]').click();
    cy.get('.transaction-item').should('not.exist');

    cy.get('.logout').click();

    cy.url().should('include', '#/customer');
  });
});
