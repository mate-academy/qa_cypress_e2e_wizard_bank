/* eslint-disable max-len */
/// <reference types='cypress' />
import { faker } from '@faker-js/faker';

describe('Bank app - Hermione Granger account', () => {
  const depositAmount = `${faker.number.int({ min: 500, max: 1000 })}`;
  const withdrawAmount = `${faker.number.int({ min: 50, max: 500 })}`;
  const balanceAfterDeposit = parseInt(depositAmount);
  const finalBalance = balanceAfterDeposit - parseInt(withdrawAmount);

  const user = 'Hermione Granger';
  const accountNumber = '1001';

  before(() => {
    cy.visit(
      'https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login'
    );
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
    cy.contains('.ng-binding', 'Dollar').should('be.visible');

    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type(depositAmount);
    cy.contains('[type="submit"]', 'Deposit').click();

    cy.get('[ng-show="message"]').should('contain.text', 'Deposit Successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', depositAmount)
      .should('be.visible');

    cy.get('[ng-click="withdrawl()"]').click();
    cy.get('[placeholder="amount"]').type(withdrawAmount);
    cy.contains('[type="submit"]', 'Withdraw').click();

    cy.get('[ng-show="message"]').should(
      'contain.text',
      'Transaction successful'
    );
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', finalBalance.toString())
      .should('be.visible');

    cy.contains('.btn', 'Transactions').click();

    cy.get('table')
      .should('contain.text', 'Credit')
      .and('contain.text', depositAmount)
      .and('contain.text', 'Debit')
      .and('contain.text', withdrawAmount);

    cy.contains('.btn', 'Back').click();

    cy.get('[name="accountSelect"]').select('1002');

    cy.contains('.btn', 'Transactions').click();
    cy.get('table tbody tr').should('have.length', 0);

    cy.contains('.btn', 'Logout').click();
    cy.contains('.btn', 'Customer Login').should('be.visible');
  });
});
