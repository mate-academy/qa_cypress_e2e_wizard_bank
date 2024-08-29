/// <reference types='cypress' />
import { faker } from '@faker-js/faker';

describe('Bank app', () => {
  const depositAmount = `${faker.number.int({ min: 500, max: 1000 })}`;
  const withdrawAmount = `${faker.number.int({ min: 50, max: 500 })}`;
  const balance = depositAmount - withdrawAmount;
  const user = 'Hermoine Granger';
  const accountNumber = '1002';
  const accountNumber2 = '1003';

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermiones bank account', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('[name="userSelect"]').select(user);
    cy.contains('.btn', 'Login').click();

    cy.get('[name="accountSelect"]').select(accountNumber);

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', accountNumber)
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', '0')
      .should('be.visible');
    cy.contains('.ng-binding', 'Pound').should('be.visible');

    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type(depositAmount);
    cy.contains('[type="submit"]', 'Deposit').click();

    cy.get('[ng-show="message"]').should('contain', 'Deposit Successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', depositAmount)
      .should('be.visible');

    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw').should('be.visible');
    cy.get('[placeholder="amount"]').type(withdrawAmount);
    cy.contains('[type="submit"]', 'Withdraw').click();

    cy.get('[ng-show="message"]').should('contain', 'Transaction successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balance)
      .should('be.visible');

    cy.get('[ng-click="transactions()"]').click();
    cy.get('#anchor0 > :nth-child(3)').should('contain', 'Credit');
    cy.get('#anchor1 > :nth-child(3)').should('contain', 'Debit');
    cy.get('.fixedTopBox > [style="float:left"]').click();
    cy.get('[name="accountSelect"]').select(accountNumber2);
    cy.get('[ng-class="btnClass1"]').click();
    cy.get('.marTop').should('not.contain', '#anchor0 > :nth-child(3)');

    cy.get('.logout').click();
    cy.get('.mainhdr').should('not.contain', 'logout');
  });
});
