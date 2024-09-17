import { faker } from '@faker-js/faker';
const { generateRandomNumber } = require('../support/generate');
/// <reference types='cypress' />

describe('Bank app', () => {
  const user = 'Hermoine Granger';
  const accountNumber = '1001';
  const accountNumber2 = '1002';
  /// we can use this code from faker (is simpler):
  /// const depositAmount = `${faker.number.int({ min: 1, max: 2000 })}`;
  const randomAmount = generateRandomNumber();
  const withdrawAmount = `${faker.number.int({ min: 20, max: 200 })}`;
  const balance = randomAmount + 5096;

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    // Account details
    cy.get('button[ng-click="customer()"]').click();
    cy.get('#userSelect').select(user);
    cy.get('button[type="submit"]').click();
    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', accountNumber);
    cy.contains('[ng-hide="noAccount"]', 'Balance').contains('strong', '5096');
    cy.contains('[ng-hide="noAccount"]', 'Currency')
      .contains('strong', 'Dollar');
    // Deposit
    cy.get('button[ng-class="btnClass2"]').click();
    cy.findByPlaceholder('amount').type(randomAmount);
    cy.get('button[type="submit"]').click();
    cy.contains('span[ng-show="message"]', 'Deposit Successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains(5096 + randomAmount);
    // Withdraw
    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw')
      .should('be.visible');
    cy.get('[placeholder="amount"]').type(withdrawAmount);
    cy.contains('[type="submit"]', 'Withdraw').click();
    cy.contains('span[ng-show="message"]', 'Transaction successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains(balance - withdrawAmount);
    // Transactions
    cy.get('[ng-click="transactions()"]').click();
    cy.get('#start').click();
    cy.get('#start').type('2024-09-17T00:00:00');
    cy.get('#anchor0 > :nth-child(2)')
      .should('contain', randomAmount);
    cy.get('#anchor1 > :nth-child(2)')
      .should('contain', withdrawAmount);
    // Change account
    cy.get('.fixedTopBox > [style="float:left"]').click();
    cy.get('#accountSelect').select(accountNumber2);
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
