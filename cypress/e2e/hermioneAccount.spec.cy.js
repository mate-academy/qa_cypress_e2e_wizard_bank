/// <reference types='cypress' />
import { faker } from '@faker-js/faker';

describe('Bank app', () => {
  const accountNumber = '1001';
  const depositHermiona = faker.number.int({ min: 10, max: 1000 });
  const withdrawHermiona  = faker.number.int({ min: 1, max: 500 });
  let balance = 5096;
  const date = '2024-08-27T00:00';

  before(() => {
    cy.visit('/');
  });

  it("should provide the ability to work with Hermione's bank account", () => {
    // Step 1: Customer login
    cy.get('.btn').contains('Customer Login').click();

    // Step 2: Select the user “Hermione Granger”
    // Replace text with a value if text selection doesn't work
    cy.get('.form-control').select('1'); // Using the value '1' instead of text

    // Step 3: Log in
    cy.get('form.ng-valid > .btn').click();

    // Step 4: Waiting for the content to load
    cy.contains('[ng-hide="noAccount"]', 'Account Number').should('be.visible');

    // Step 5: Checking the opening balance
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balance)
      .should('be.visible');

    // Check the currency
    cy.contains('.ng-binding', 'Dollar').should('be.visible');

    // Step 6: Deposit
    cy.get('.btn').contains('Deposit').click();
    cy.get('input[type="number"]').type(depositHermiona);
    cy.get('.btn-default').contains('Deposit').click();
    cy.get('[ng-show="message"]').should('contain', 'Deposit Successful');

    // Balance update after deposit
    balance += depositHermiona;
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balance)
      .should('be.visible');

    // Step 7: Withdrawal.
    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw').should('be.visible');
    cy.get('input[type="number"]').type(withdrawHermiona);
    cy.contains('[type="submit"]', 'Withdraw').click();
    cy.get('[ng-show="message"]').should('contain', 'Transaction successful');

    // Update the balance after withdrawal
    balance -= withdrawHermiona;
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balance)
      .should('be.visible');

    // Step 8: Verify transactions
    cy.get('.btn').contains('Transactions').click();
    cy.get('#start').type(date);
    cy.get('#anchor0').should('contain.text', depositHermiona);
    cy.get('#anchor0').should('contain.text', 'Credit');
    cy.get('#anchor1').should('contain.text', withdrawHermiona);
    cy.get('#anchor1').should('contain.text', 'Debit');

    // Step 9: Return and verify account changes
    cy.get('.btn').contains('Back').click();
    cy.get('#accountSelect').select('number:1002');
    cy.get('[ng-class="btnClass1"]').click();
    cy.get('#anchor0').should('not.exist');

    // Step 10: Log out of the system
    cy.get('.logout').click();
    cy.url().should('include', 'customer');
  });
});
