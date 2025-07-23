/// <reference types='cypress' />

describe('Bank app', () => {
  let balance = 5096;
  const depositAmount = 100;
  const withdrawAmount = 96;
  const user = 'Hermoine Granger';
  const accountNumber = '1001';
  const accountNumber2 = '1002';
  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermiones bank account', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('[name="userSelect"]').select(user);
    cy.contains('.btn', 'Login').click();

    cy.get('#accountSelect').select(String(accountNumber));

    cy.get('.borderM > :nth-child(3) > :nth-child(1)').contains(accountNumber);
    cy.get('.borderM > :nth-child(3) > :nth-child(2)').contains(balance);
    cy.get('.borderM > :nth-child(3) > :nth-child(3)').contains('Dollar');

    cy.contains('button', 'Deposit').click();
    cy.get('[placeholder="amount"]').type(String(depositAmount));
    cy.contains('[type="submit"]', 'Deposit').click();

    balance += depositAmount;
    cy.contains('.error', 'Deposit Successful');
    cy.get('.borderM > :nth-child(3) > :nth-child(2)').contains(balance);

    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw').should('be.visible');
    cy.get('[placeholder="amount"]').type(String(withdrawAmount));
    cy.contains('[type="submit"]', 'Withdraw').click();

    balance -= withdrawAmount;
    cy.get('[ng-show="message"]').should('contain', 'Transaction successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance').contains(balance);

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500);

    cy.contains('button', 'Transactions').click();

    cy.get('#start').clear();
    cy.get('#start').type('2025-07-22T11:03');

    cy.get('[ng-repeat*="tx in transactions"]')
      .last()
      .find('td')
      .eq(1)
      .should('contain.text', withdrawAmount);

    cy.get('[ng-repeat*="tx in transactions"]')
      .eq(-2)
      .find('td')
      .eq(1)
      .should('contain.text', depositAmount);

    cy.contains('button', 'Back').click();

    cy.get('#accountSelect').select(String(accountNumber2));
    cy.contains('button', 'Transactions').click();
    cy.get('table.table-bordered tbody').find('tr').should('have.length', 0);

    cy.contains('button', 'Logout').click();
    cy.url().should('equal', Cypress.config('baseUrl') + 'customer');
  });
});
