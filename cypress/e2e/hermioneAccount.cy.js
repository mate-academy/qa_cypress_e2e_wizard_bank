/// <reference types='cypress' />

describe('Bank app', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.reload(true);
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    const depositAmount = 1200;
    const withdrawAmount = 345;

    cy.contains('.btn', 'Customer Login').click();
    cy.get('#userSelect').select('Hermoine Granger');
    cy.get('#userSelect').should('contain', 'Hermoine Granger');
    cy.contains('.btn', 'Login').click();

    // Переконатися, що можна вибирати акаунт і вибрати той, який ти хотів
    cy.contains('Deposit').should('be.visible');
    cy.get('#accountSelect').should('exist');

    cy.get('#accountSelect')
      .find('option')
      .then((options) => {
        const firstAccount = options[1].value;
        cy.get('#accountSelect').select(firstAccount);
      });

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .parent()
      .find('strong')
      .then(($el) => {
        const initialBalance = Number($el.text()) || 0;
        const expectedAfterDeposit = initialBalance + depositAmount;
        const expectedAfterWithdraw = expectedAfterDeposit - withdrawAmount;

        cy.contains('.btn', 'Deposit').click();
        cy.get('[ng-model="amount"]').clear();
        cy.get('[ng-model="amount"]').type(depositAmount.toString());
        cy.contains('[type="submit"]', 'Deposit').click();

        cy.contains('[ng-hide="noAccount"]', 'Balance')
          .parent()
          .find('strong', { timeout: 10000 })
          .should('contain', expectedAfterDeposit);

        cy.get('[ng-click="withdrawl()"]').click();
        cy.contains('[type="submit"]', 'Withdraw').should('be.visible');
        cy.get('[ng-model="amount"]').clear();
        cy.get('[ng-model="amount"]').type(withdrawAmount.toString());
        cy.contains('[type="submit"]', 'Withdraw').click();

        cy.contains('[ng-hide="noAccount"]', 'Balance')
          .parent()
          .find('strong', { timeout: 10000 })
          .should('contain', expectedAfterWithdraw);

        cy.contains('[ng-click="transactions()"]', 'Transactions').click();

        cy.get('tbody tr', { timeout: 15000 })
          .should('exist')
          .then(($rows) => {
            cy.log('rows count: ' + $rows.length);
          });

        cy.get('tbody tr')
          .contains('td', depositAmount.toString())
          .parent().within(() => {
            cy.get('td')
              .eq(2)
              .should('contain', 'Credit');
          });

        cy.get('tbody tr')
          .contains('td', withdrawAmount.toString())
          .parent()
          .within(() => {
            cy.get('td')
              .eq(2)
              .should('contain', 'Debit');
          });
      });
    cy.contains('[ng-click="back()"]', 'Back').click();
    cy.get('#accountSelect')
      .find('option')
      .then((options) => {
        const firstAccount = options[0].value;
        cy.get('#accountSelect').select(firstAccount);
      });
    cy.contains('[ng-click="transactions()"]', 'Transactions').click();

    cy.get('tbody', { timeout: 10000 }).should('exist');

    cy.get('tbody', { timeout: 10000 })
      .should('not.contain', depositAmount.toString())
      .and('not.contain', withdrawAmount.toString());
    cy.contains('.logout', 'Logout').click();
    cy.get('#userSelect').should('exist');
  });
});
