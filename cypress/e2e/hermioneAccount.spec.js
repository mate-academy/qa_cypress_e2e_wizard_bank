/// <reference types="cypress" />

import { faker } from '@faker-js/faker';

describe('Bank app', () => {
  const depositAmount = faker.number.int({ min: 500, max: 1000 });
  const withdrawAmount = faker.number.int({ min: 50, max: 500 });

  // Read the balance from the account summary.
  const getBalance = () => {
    return cy.get('[ng-hide="noAccount"] strong')
      .invoke('text')
      .then((text) => {
        const match = text.match(/1001\s*(\d+)\s*Dollar/);

        expect(match).to.not.equal(null);

        return Number(match[1]);
      });
  };

  before(() => {
    cy.visit('/');
  });

  it('should work with Hermoine Granger\'s bank account', () => {
    // 1–3. Login as Hermoine Granger
    cy.contains('.btn', 'Customer Login').click();
    cy.get('[name="userSelect"]').select('1');
    cy.contains('.btn', 'Login').click();

    // 4. Assert account number
    cy.get('[ng-hide="noAccount"]')
      .should('contain.text', '1001');

    // 5. Assert initial balance
    getBalance().then((initialBalance) => {
      expect(Number.isFinite(initialBalance)).to.equal(true);

      // 6. Assert currency
      cy.get('[ng-hide="noAccount"]')
        .should('contain.text', 'Dollar');

      // 7–9. Deposit money
      cy.get('[ng-click="deposit()"]').click();
      cy.get('[placeholder="amount"]').type(String(depositAmount));
      cy.contains('[type="submit"]', 'Deposit').click();

      // 10. Assert deposit success message
      cy.get('[ng-show="message"]')
        .should('contain', 'Deposit Successful');

      // 11. Assert balance after deposit
      getBalance().should((balance) => {
        expect(balance).to.equal(initialBalance + depositAmount);
      });

      // 12–14. Withdraw money
      cy.get('[ng-click="withdrawl()"]').click();
      cy.get('[placeholder="amount"]').type(String(withdrawAmount));
      cy.contains('[type="submit"]', 'Withdraw').click();

      // 15. Assert withdrawal success message
      cy.get('[ng-show="message"]')
        .should('contain', 'Transaction successful');

      // 16. Assert balance after withdrawal
      getBalance().should((balance) => {
        expect(balance).to.equal(
          initialBalance + depositAmount - withdrawAmount
        );
      });
    });

    // 17. Open transactions
    cy.contains('.btn', 'Transactions').click();

    // 18. Assert deposit and withdrawal transaction details
    cy.contains('table tbody tr', String(depositAmount))
      .should('contain', 'Credit');

    cy.contains('table tbody tr', String(withdrawAmount))
      .should('contain', 'Debit');

    // 19. Return to the account page
    cy.contains('.btn', 'Back').click();

    // 20. Change account number
    cy.get('[ng-click="accountSelect()"]').click();
    cy.get('[ng-model="accountNo"]').select('1002');

    // 21. Open transactions for the selected account
    cy.contains('.btn', 'Transactions').click();

    // 22. Assert this account has no transactions
    cy.get('table tbody tr').should('not.exist');

    // Return to the account page before logging out
    cy.contains('.btn', 'Back').click();

    // 23. Logout
    cy.contains('.btn', 'Logout').click();

    // 24. Assert the user is logged out
    cy.contains('.btn', 'Customer Login')
      .should('be.visible');
  });
});
