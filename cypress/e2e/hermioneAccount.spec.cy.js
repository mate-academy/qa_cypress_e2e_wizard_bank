/* eslint-disable cypress/no-unnecessary-waiting */
/// <reference types='cypress' />

describe('Bank app', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.url().should('include', '#/login');

    cy.contains('button', 'Customer Login')
      .click();

    cy.get('#userSelect')
      .select('Hermoine Granger');

    cy.get('[type="submit"]')
      .click();

    cy.get('#accountSelect').as('accNumber');

    cy.get('@accNumber')
      .select('1002');

    cy.get('@accNumber')
      .should('contain.value', '1002');

    cy.contains('strong', /^0$/)
      .should('exist');

    cy.contains('strong', /^Pound$/)
      .should('exist');

    cy.contains('.btn', 'Deposit')
      .click();

    cy.get('[placeholder="amount"]')
      .type(1000);

    cy.contains('[type="submit"]', 'Deposit')
      .click();

    cy.contains('Deposit Successful')
      .should('exist');

    cy.contains('strong', /^1000$/)
      .should('exist');

    cy.contains('.tab', 'Withdrawl')
      .click();

    cy.contains('Deposit Successful')
      .should('not.exist');

    cy.get('[placeholder="amount"]')
      .type(123);

    cy.contains('[type="submit"]', 'Withdraw')
      .click();

    cy.contains('Transaction successful')
      .should('exist');

    cy.contains('strong', /^877$/)
      .should('exist');

    cy.contains('.tab', 'Transactions')
      .as('transactionBtn');

    cy.get('@transactionBtn')
      .click();

    cy.visit('/listTx');

    cy.wait(1000);

    cy.visit('/account');

    cy.wait(1000);

    cy.visit('/listTx');

    cy.get('tr[id^="anchor"]')
      .should('have.length', 2);

    cy.contains('.btn', 'Back')
      .click();

    cy.get('@accNumber')
      .select('1003');

    cy.get('@accNumber')
      .should('contain.value', '1003');

    cy.get('@transactionBtn')
      .click();

    cy.get('tr[id^="anchor"]')
      .should('have.length', 0);

    cy.contains('.logout', 'Logout')
      .click();

    cy.get('#userSelect')
      .should('exist');
  });
});
