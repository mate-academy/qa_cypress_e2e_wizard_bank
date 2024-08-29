import { faker } from '@faker-js/faker';
/// <reference types='cypress' />

describe('Bank app', () => {
  const user = 'Hermoine Granger';
  const depositAmount = `${faker.number.int({ min: 500, max: 1000 })}`;
  const withdrawAmount = `${faker.number.int({ min: 50, max: 500 })}`;
  const startBalance = '5096';
  const balanceAfterDeposit = parseInt(startBalance) + parseInt(depositAmount);
  const balanceAfterWithdrawal =
  parseInt(balanceAfterDeposit) - parseInt(withdrawAmount);
  const accountNumber = '1001';

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione bank account', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('[name="userSelect"]').select(user);
    cy.contains('.btn', 'Login').click();

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', accountNumber)
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', startBalance)
      .should('be.visible');
    cy.contains('.ng-binding', 'Dollar')
      .should('be.visible');

    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type(depositAmount);
    cy.contains('[type="submit"]', 'Deposit').click();

    cy.get('[ng-show="message"]')
      .should('contain', 'Deposit Successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balanceAfterDeposit)
      .should('be.visible');

    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw')
      .should('be.visible');
    cy.get('[placeholder="amount"]').type(withdrawAmount);
    cy.contains('[type="submit"]', 'Withdraw').click();

    cy.get('[ng-show="message"]')
      .should('contain', 'Transaction successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balanceAfterWithdrawal)
      .should('be.visible');
    cy.get('[ng-click="transactions()"]').click();
    cy.get('tr > :nth-child(1)').should('be.visible');
    cy.get('a[ng-click*="sortType = \'date\'"]').click({ force: true });
    cy.get('[ng-click="back()"]').click();
    cy.get('#accountSelect').select('1002');
    cy.get('[ng-click="transactions()"]').click();
    cy.get('td.ng-binding').should('not.exist');
    cy.get('[ng-click="byebye()"]').click();
    cy.get('#userSelect').should('be.visible');
  });
});
