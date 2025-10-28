/// <reference types='cypress' />

import { faker } from '@faker-js/faker';

describe('Bank app', () => {
  const user = 'Hermoine Granger';
  const accountNumber = '1001';
  const accountCurrency = 'Dollar';

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.loginUser(user);

    cy.get('[ng-hide="noAccount"]').find('strong').eq(1).invoke('text')
      .then((text) => {
        const initialBalance = Number(text.trim());
        const depositAmount = faker.number.int({ min: 500, max: 1000 });
        const withdrawAmount = faker.number.int({ min: 50, max: 500 });
        const balance = initialBalance + depositAmount - withdrawAmount;

        cy.assertAccountProperty('Account Number', accountNumber);
        cy.assertAccountProperty('Balance', `${initialBalance}`);
        cy.assertAccountProperty('Currency', `${accountCurrency}`);

        cy.makeDeposit(depositAmount);
        cy.assertSuccessMessage('Deposit Successful');
        cy.assertAccountProperty(
          'Balance',
          `${initialBalance + depositAmount}`
        );

        cy.makeWithdrawal(withdrawAmount);
        cy.assertSuccessMessage('Transaction successful');
        cy.assertAccountProperty('Balance', `${balance}`);

        cy.clickButton('transactions');
        cy.assertTransactionDetails(-2, depositAmount, 'Credit');
        cy.assertTransactionDetails(-1, withdrawAmount, 'Debit');

        cy.clickButton('back');
        cy.get('#accountSelect').select('1002');
        cy.clickButton('transactions');
        cy.get('table tbody tr').should('have.length', 0);

        cy.logoutUser();
        cy.get('#userSelect').should('be.visible');
      });
  });
});
