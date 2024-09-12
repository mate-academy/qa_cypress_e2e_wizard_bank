/// <reference types='cypress' />
import { faker } from '@faker-js/faker';

describe('Bank app', () => {
  const depositAmount = `${faker.number.int({ min: 500, max: 1000 })}`;
  const withdrawAmount = `${faker.number.int({ min: 50, max: 500 })}`;
  const balance = parseInt(depositAmount) - parseInt(withdrawAmount);
  const user = 'Hermoine Granger';
  const accountNumber = '1002';
  const accountNumber2 = '1003';

  before(() => {
    cy.visit('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login');
  });

  it('should provide the ability to work with Hermiones bank account', () => {
    // Log in as Hermoine Granger
    cy.contains('.btn', 'Customer Login').click();
    cy.get('[name="userSelect"]').select(user);
    cy.contains('.btn', 'Login').click();

    // Select the first account
    cy.get('[name="accountSelect"]').select(accountNumber);

    // Verify account details
    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', accountNumber)
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', '0')
      .should('be.visible');
    cy.contains('.ng-binding', 'Pound').should('be.visible');

    // Perform deposit
    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type(depositAmount);
    cy.contains('[type="submit"]', 'Deposit').click();

    // Verify balance after deposit
    cy.get('[ng-show="message"]').should('contain', 'Deposit Successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', depositAmount)
      .should('be.visible');

    // Perform withdrawal
    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw').should('be.visible');
    cy.get('[placeholder="amount"]').type(withdrawAmount);
    cy.contains('[type="submit"]', 'Withdraw').click();

    // Verify balance after withdrawal
    cy.get('[ng-show="message"]').should('contain', 'Transaction successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balance)
      .should('be.visible');
    cy.get('[ng-click="transactions()"]').click();
    cy.get('.fixedTopBox > [style="float:left"]').click();

    // Select the second account
    cy.get('[name="accountSelect"]').select(accountNumber2);
    cy.get('[ng-class="btnClass1"]').click();
    cy.get('.marTop').should('not.contain', '#anchor0 > :nth-child(3)');

    // Log out
    cy.get('.logout').click();
    cy.get('.mainhdr').should('not.contain', 'logout');
    });
});
