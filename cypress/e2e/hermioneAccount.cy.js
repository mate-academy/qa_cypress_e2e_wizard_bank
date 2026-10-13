import { faker } from '@faker-js/faker';
/// <reference types='cypress' />

describe('Hermoine Granger Bank Account', () => {
  // Generate test data using faker
  const depositAmount = faker.number.int({ min: 500, max: 1000 });
  const withdrawAmount = faker.number.int({ min: 50, max: 400 });

  const user = 'Hermoine Granger';
  const accountNumber = '1001';

  beforeEach(() => {
    // Clear browser storage to try and reset state for a new test run
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit('/');
  });

  it('should provide the ability to work with Hermoine\'s bank account', () => {
    let startingBalance = 0;
    let expectedBalanceAfterDeposit = 0;
    let expectedBalanceAfterWithdraw = 0;

    // 1. Click [Customer Login]
    cy.contains('.btn', 'Customer Login').click();

    // 2. Select Hermoine Granger
    cy.get('[name="userSelect"]').select(user);

    // 3. Click [Login]
    cy.contains('.btn', 'Login').click();

    // 4. Assert Account Number
    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', accountNumber)
      .should('be.visible');

    // 5. Assert Balance & Capture Dynamic Starting Balance
    cy.get('.center')
      .find('strong')
      .eq(1)
      .invoke('text')
      .then((text) => {
        startingBalance = Number(text.replace(/,/g, '').trim());
      });

    // 6. Assert Currency
    cy.contains('.ng-binding', 'Dollar').should('be.visible');

    // 7. Click [Deposit]
    cy.get('[ng-click="deposit()"]').click();

    // 8. Type deposit value
    cy.get('form[ng-submit="deposit()"] input').type(depositAmount.toString());

    // 9. Click [Deposit]
    cy.get('form[ng-submit="deposit()"] button[type="submit"]').click();

    // 10. Assert success message
    cy.get('[ng-show="message"]').should('contain', 'Deposit Successful');

    // 11. Assert Balance
    cy.get('.center')
      .find('strong')
      .eq(1)
      .invoke('text')
      .then((text) => {
        const actualBalance = Number(text.replace(/,/g, '').trim());
        expectedBalanceAfterDeposit = startingBalance + depositAmount;
        expect(actualBalance).to.equal(expectedBalanceAfterDeposit);
      });

    // 12. Click [Withdrawl]
    cy.get('[ng-click="withdrawl()"]').click();

    // 13. Type amount of money to withdraw
    cy.get('form[ng-submit="withdrawl()"] input').type(
      withdrawAmount.toString()
    );

    // 14. Click [Withdraw]
    cy.get('form[ng-submit="withdrawl()"] button[type="submit"]').click();

    // 15. Assert success message
    cy.get('[ng-show="message"]').should('contain', 'Transaction successful');

    // 16. Assert Balance
    cy.get('.center')
      .find('strong')
      .eq(1)
      .invoke('text')
      .then((text) => {
        const actualBalance = Number(text.replace(/,/g, '').trim());
        expectedBalanceAfterWithdraw =
          expectedBalanceAfterDeposit - withdrawAmount;
        expect(actualBalance).to.equal(expectedBalanceAfterWithdraw);
      });

    // 17. Click [Transactions]
    cy.get('[ng-click="transactions()"]').click();

    // 18. Assert both transactions details
    // Note: The GlobalsQA app has a bug where it sometimes fails to render the table rows.
    // We assert with a long timeout to give it the best chance.
    cy.get('table', { timeout: 10000 })
      .should('contain', 'Credit')
      .and('contain', depositAmount.toString())
      .and('contain', 'Debit')
      .and('contain', withdrawAmount.toString());

    // 19. Click [Back]
    cy.contains('button', 'Back').click();

    // 20. Change Account number (Logout and login as Harry Potter to test empty account)
    cy.contains('button', 'Logout').click();

    // We are now on the Customer Login page.
    cy.get('[name="userSelect"]').select('Harry Potter');
    cy.contains('.btn', 'Login').click();
    cy.get('[name="accountSelect"]').select('1004');

    // 21. Click [Transactions]
    cy.get('[ng-click="transactions()"]').click();

    // 22. Assert no transactions for this account
    // The app does not display an "Empty" message, it just renders an empty table.
    // We assert that the table body has no rows.
    cy.get('table tbody tr').should('have.length', 0);
    cy.get('table').should('not.contain', depositAmount.toString());
    cy.get('table').should('not.contain', withdrawAmount.toString());

    // 23. Click [Logout]
    cy.contains('button', 'Logout').click();

    // 24. Assert user is logged out
    // After logout, we are on the Customer Login page. Click 'Home' to go back to the main screen.
    cy.contains('button', 'Home').click();
    cy.contains('.btn', 'Customer Login').should('be.visible');
    cy.contains('.btn', 'Bank Manager Login').should('be.visible');
  });
});
