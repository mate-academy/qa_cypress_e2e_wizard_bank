import { faker } from '@faker-js/faker';
/// <reference types='cypress' />

describe('Bank app', () => {
  const depositAmount = `${faker.number.int({ min: 500, max: 1000 })}`;
  const withdrawAmount = `${faker.number.int({ min: 50, max: 500 })}`;
  const initialBalance = 5096;
  const balanceAfterDeposit = initialBalance + parseInt(depositAmount);
  const balanceAfterWithdrawal = balanceAfterDeposit - parseInt(withdrawAmount);
  const user = 'Hermoine Granger';
  const accountNumber = '1001';

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with bank account', () => {
    // Log in
    cy.contains('.btn', 'Customer Login').click();
    cy.get('[name="userSelect"]').select(user);
    cy.contains('.btn', 'Login').click();

    // Assert the account number
    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', accountNumber)
      .should('be.visible');

    // Assert the balance
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', initialBalance.toString())
      .should('be.visible');

    // Assert the currency
    cy.contains('.ng-binding', 'Dollar')
      .should('be.visible');

    // Enter deposit
    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type(depositAmount);
    cy.contains('[type="submit"]', 'Deposit').click();

    // Assert success message of deposit and balance
    cy.get('[ng-show="message"]')
      .should('contain', 'Deposit Successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balanceAfterDeposit.toString())
      .should('be.visible');

    // Enter amount of money to withdraw
    cy.get('[ng-click="withdrawl()"]').click();
    cy.wait(1000);
    cy.get('label').should('contain', 'Amount to be Withdrawn :');
    cy.get('.form-control').type(withdrawAmount);
    cy.get('form.ng-dirty > .btn').click();

    // Assert success message of withdraw and balance (15)
    cy.get('.error')
      .should('contain', 'Transaction successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balanceAfterWithdrawal.toString())
      .should('be.visible');

    // Assert both transactions details: Deposit and Withdraw
    cy.get('[ng-class="btnClass1"]').click();
    cy.get('tr > :nth-child(1)').should('be.visible');
    cy.get('a[ng-click*="sortType = \'date\'"]').click({ force: true });
    cy.get('[ng-click="back()"]').click();

    // Change Account number
    cy.get('[name="accountSelect"]').select('1002');

    // Assert no transactions for changed account
    cy.get('[ng-class="btnClass1"]').click();
    cy.get('.table').should('not.contain.text', 'Deposit')
      .and('not.contain.text', 'Withdraw');

    // Assert user is logged out
    cy.contains('.btn', 'Home').click();
    cy.get('.btn').contains('Customer Login').should('be.visible');
  });
});
