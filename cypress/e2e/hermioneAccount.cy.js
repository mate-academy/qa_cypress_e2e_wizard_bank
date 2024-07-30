import { faker } from '@faker-js/faker';
/// <reference types='cypress' />

describe('Bank app', () => {
  const depositAmount = `${faker.number.int({ min: 500, max: 1000 })}`;
  const withdrawAmount = `${faker.number.int({ min: 50, max: 500 })}`;
  const user = 'Hermoine Granger';
  const accountNumber = '1001';

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with bank account', () => {
    // Click Customer Login
    cy.contains('.btn', 'Customer Login').click();

    // Select Harry Potter from dropdown
    cy.get('[name="userSelect"]').select(user);

    cy.contains('.btn', 'Login').click();

    // Assert Account Number, Balance, and Currency
    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', accountNumber)
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', '0')
      .should('be.visible');
    cy.contains('.ng-binding', 'Dollar')
      .should('be.visible');

  
    cy.get('[ng-click="deposit()"]').click();

    // Type deposit value and click Deposit
    cy.get('[placeholder="amount"]').type(depositAmount);
    cy.contains('[type="submit"]', 'Deposit').click();

    // Assert success message and updated balance
    cy.get('[ng-show="message"]')
      .should('contain', 'Deposit Successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .should('be.visible');

    // Click Withdrawal
    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw')
      .should('be.visible');

    // Type withdraw value and click Withdraw
    cy.get('[placeholder="amount"]').type(withdrawAmount);
    cy.contains('[type="submit"]', 'Withdraw').click();

    // Assert success message and updated balance
    cy.get('[ng-show="message"]')
      .should('contain', 'Transaction successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .should('be.visible');

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);
    cy.get('[ng-click="transactions()"]').click();

    cy.get('#anchor0 > :nth-child(1)').should('be.visible');
    cy.get('#start').type('2024-07-29T00:00');

    cy.get('#anchor0 > :nth-child(2)').should('contain', depositAmount);
    cy.get('#anchor0 > :nth-child(3)').should('contain', 'Credit');
    cy.get('#anchor1 > :nth-child(2)').should('contain', withdrawAmount);
    cy.get('#anchor1 > :nth-child(3)').should('contain', 'Debit');

    cy.get('[ng-click="back()"]').click();

    // Change Account number
    cy.get('[name="accountSelect"]').select('1002');


    cy.get('[ng-click="transactions()"]').click();


    cy.get('tbody tr').should('not.exist');

    cy.get('[ng-click="byebye()"]').click();

    // Assert user is logged out
    cy.get('[name="userSelect"]').should('contain', 'Your Name');
  });
});