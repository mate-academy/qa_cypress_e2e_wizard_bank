import { faker } from '@faker-js/faker';
/// <reference types='cypress' />

describe('Bank app', () => {
  // Generate random deposit and withdrawal amounts
  const depositAmount = `${faker.number.int({ min: 500, max: 1000 })}`;
  const withdrawAmount = `${faker.number.int({ min: 50, max: 500 })}`;

  // Define user and account details
  const userName = 'Hermoine Granger';
  const firstNumber = '1001';
  const secondNumber = '1002';
  const balance = '5096';
  const currency = 'Dollar';

  // Calculate expected balance after deposit and withdrawal
  const depoBalance = +balance + +depositAmount;
  const finalBalance = +depoBalance - +withdrawAmount;

  const depositSuccessMessage = 'Deposit Successful';
  const wirthdrawlSuccessMessage = 'Transaction successful';

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with bank account', () => {
    // Click on 'Customer Login' button
    cy.contains('Login').click();

    // Select the customer from the dropdown list
    cy.get('[name="userSelect"]').select(userName);

    // Click on 'Login' button
    cy.contains('.btn', 'Login').click();

    // Verify the customer name displayed on the page
    cy.get('.fontBig').should('contain', userName);

    // Verify account number, balance, and currency
    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .should('contain', firstNumber);

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .should('contain', balance);

    cy.contains('[ng-hide="noAccount"]', 'Currency')
      .should('contain', currency);

    // Perform deposit action
    cy.contains('Deposit').click();
    cy.get('[placeholder="amount"]').type(depositAmount);
    cy.contains('[type="submit"]', 'Deposit').click();

    // Verify the deposit success message
    cy.contains('.error', depositSuccessMessage).should('be.visible');

    // Verify the updated balance after deposit
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .should('contain', depoBalance);

    // Perform withdrawal action
    cy.contains('Withdraw').click();
    cy.contains('[type="submit"]', 'Withdraw')
      .should('be.visible');
    cy.get('[placeholder="amount"]').type(withdrawAmount);
    cy.contains('[type="submit"]', 'Withdraw').click();

    // Verify the withdrawal success message
    cy.contains('.error', wirthdrawlSuccessMessage).should('be.visible');

    // Verify the updated balance after withdrawal
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .should('contain', finalBalance);

    // Verify the transactions
    cy.get('[ng-click="transactions()"]').click();
    cy.get('td.ng-binding').should('contain', depositAmount);
    cy.get('td.ng-binding').should('contain', withdrawAmount);

    // Navigate back to the account selection
    cy.contains('Back').click();

    // Change to a new account and verify the new account details
    cy.get('#accountSelect').select(secondNumber);
    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .should('contain', secondNumber);

    // Verify there are no transactions for the new account
    cy.get('[ng-click="transactions()"]').click();
    cy.get('td.ng-binding').should('not.exist');

    // Log out and verify that the user is logged out
    cy.contains('Logout').click();
    cy.get('[name="userSelect"]').should('be.visible');
  });
});
