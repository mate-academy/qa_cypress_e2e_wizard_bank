/// <reference types='cypress' />

import { faker } from '@faker-js/faker';

describe('Bank app', () => {
  const depositAmount = faker.number.int({ min: 500, max: 1000 });
  const withdrawAmount = faker.number.int({ min: 50, max: 500 });

  const user = 'Hermoine Granger';
  const accountNumber = '1001';

  let balance;

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.loginUser(user);

    cy.assertAccountDetails('Account Number', accountNumber);
    cy.getBalance().then((initialBalance) => {
      balance = initialBalance;
      cy.assertAccountDetails('Balance', balance);
    });
    cy.assertAccountDetails('Currency', 'Dollar');

    cy.assertBalanceChange(
      () => {
        cy.toDeposit(depositAmount);
        cy.contains('[ng-show="message"]', 'Deposit Successful');
      },
      depositAmount
    );

    cy.assertBalanceChange(
      () => {
        cy.doWithdrawal(withdrawAmount);
        cy.contains('[ng-show="message"]', 'Transaction successful');
      },
      -withdrawAmount
    );

    cy.clickButton('transactions');
    cy.assertTransactionDetails(-2, depositAmount, 'Credit');
    cy.assertTransactionDetails(-1, withdrawAmount, 'Debit');

    cy.clickButton('back');
    cy.get('#accountSelect').select('1002');
    cy.clickButton('transactions');
    cy.get('table tbody tr').should('have.length', 0);

    cy.logoutUser();
  });
});
