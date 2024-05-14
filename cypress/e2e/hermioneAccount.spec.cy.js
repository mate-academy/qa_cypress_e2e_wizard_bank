/// <reference types='cypress' />
import { faker } from '@faker-js/faker';

describe('Bank app', () => {
  before(() => {
    cy.visit('/');
  });

  const user = 'Hermoine Granger';
  const accountNumber = 1001;
  const currency = 'Dollar';
  const firstBalance = 5096;
  const depositSuccessMessage = 'Deposit Successful';
  const transactionSuccessMessage = 'Transaction successful';

  const depositAmount = `${faker.number.int({ min: 500, max: 1000 })}`;
  const withdrawlAmount = `${faker.number.int({ min: 50, max: 500 })}`;
  const balance = firstBalance + parseInt(depositAmount);
  const afterWithdraw = balance - parseInt(withdrawlAmount);

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('#userSelect').select(user);
    cy.contains('.btn', 'Login').click();

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', accountNumber);
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', firstBalance);
    cy.contains('.ng-binding', currency);

    cy.contains('.btn', 'Deposit').click();
    cy.findByPlaceholder('amount').type(depositAmount);
    cy.contains('.btn-default', 'Deposit').click();
    cy.contains('.error', depositSuccessMessage).should('be.visible');

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balance);

    cy.contains('.btn', 'Withdrawl').click();
    cy.contains('[type="submit"]', 'Withdraw').should('be.visible'); // to bypass a bug
    cy.findByPlaceholder('amount').type(withdrawlAmount);
    cy.contains('.btn-default', 'Withdraw').click();
    cy.contains('.error', transactionSuccessMessage).should('be.visible');

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', afterWithdraw);
    cy.contains('.btn', 'Transactions').click();
    cy.get('td.ng-binding')
      .should('contain', depositAmount, withdrawlAmount);

    cy.contains('.btn', 'Back').click();
    cy.get('#accountSelect')
      .should('contain', '1003')
      .select('1003');

    cy.contains('.btn', 'Transactions').click();
    cy.get('td.ng-binding').should('not.exist');
    cy.contains('.logout', 'Logout').click();

    cy.get('#userSelect').should('be visible');
  });
});
