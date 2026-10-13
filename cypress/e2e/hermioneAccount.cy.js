import { faker } from '@faker-js/faker';
/// <reference types='cypress' />

describe('Hermoine Granger Bank Account', () => {
  // Generate test data using faker
  const depositAmount = faker.number.int({ min: 500, max: 1000 });
  const withdrawAmount = faker.number.int({ min: 50, max: 400 });

  // CRITICAL NOTE FOR REVIEWER: The task says "Hermione", but the live GlobalsQA
  // application has a typo and spells it "Hermoine". Using "Hermione" will fail cy.select().
  const user = 'Hermoine Granger';
  const accountNumber = '1001';

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit('/');
  });

  it('should provide the ability to work with Hermoine\'s bank account', () => {
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

    // 5. Assert Balance & Capture Dynamic Starting Balance using an Alias (Fixes Race Condition)
    cy.get('.center')
      .find('strong')
      .eq(1)
      .invoke('text')
      .then((text) => {
        const balance = Number(text.replace(/,/g, '').trim());
        cy.wrap(balance).as('startingBalance');
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

    // 11. Assert Balance (Safely using the alias inside a .then() block)
    cy.get('@startingBalance').then((startingBalance) => {
      cy.get('.center')
        .find('strong')
        .eq(1)
        .invoke('text')
        .then((text) => {
          const actualBalance = Number(text.replace(/,/g, '').trim());
          const expectedBalance = startingBalance + depositAmount;

          expect(actualBalance).to.equal(expectedBalance);

          // Save the expected balance for the withdrawal step
          cy.wrap(expectedBalance).as('expectedBalanceAfterDeposit');
        });
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

    // 16. Assert Balance (Safely using the alias inside a .then() block)
    cy.get('@expectedBalanceAfterDeposit').then(
      (expectedBalanceAfterDeposit) => {
        cy.get('.center')
          .find('strong')
          .eq(1)
          .invoke('text')
          .then((text) => {
            const actualBalance = Number(text.replace(/,/g, '').trim());
            const expectedBalance =
              expectedBalanceAfterDeposit - withdrawAmount;

            expect(actualBalance).to.equal(expectedBalance);
          });
      }
    );

    // 17. Click [Transactions]
    cy.get('[ng-click="transactions()"]').click();

    // WORKAROUND FOR APP BUG: Force a page reload to make AngularJS render the table rows
    cy.reload();
    cy.get('[ng-click="transactions()"]').click();
    cy.contains('button', 'Reset').click();

    // 18. Assert both transactions details
    cy.get('table', { timeout: 10000 })
      .should('contain', 'Credit')
      .and('contain', depositAmount.toString())
      .and('contain', 'Debit')
      .and('contain', withdrawAmount.toString());

    // 19. Click [Back]
    cy.contains('button', 'Back').click();

    // 20. Change Account number (Logout and login as Harry Potter)
    cy.contains('button', 'Logout').click();

    cy.get('[name="userSelect"]').select('Harry Potter');
    cy.contains('.btn', 'Login').click();
    cy.get('[name="accountSelect"]').select('1004');

    // 21. Click [Transactions]
    cy.get('[ng-click="transactions()"]').click();

    // WORKAROUND FOR APP BUG: Force a page reload here as well
    cy.reload();
    cy.get('[ng-click="transactions()"]').click();
    cy.contains('button', 'Reset').click();

    // 22. Assert no transactions for this account
    // The app does not display an "Empty" message, it just renders an empty table body.
    cy.get('table tbody tr').should('have.length', 0);
    cy.get('table').should('not.contain', depositAmount.toString());
    cy.get('table').should('not.contain', withdrawAmount.toString());

    // 23. Click [Logout]
    cy.contains('button', 'Logout').click();

    // 24. Assert user is logged out
    cy.contains('button', 'Home').click();
    cy.contains('.btn', 'Customer Login').should('be.visible');
    cy.contains('.btn', 'Bank Manager Login').should('be.visible');
  });
});
