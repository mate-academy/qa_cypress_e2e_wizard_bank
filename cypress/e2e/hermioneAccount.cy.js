/// <reference types='cypress' />

describe('Bank app', () => {
  before(() => {
    cy.visit(
      'https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login'
    );
  });

  it(`should provide the ability to work with Hermione's bank account`, () => {
    cy.contains('button', 'Customer Login').click();

    // 2
    cy.get('select').select('Hermoine Granger');
    // 3
    cy.contains('button', 'Login').click();
    // 4, 5, 6
    cy.contains('div', 'Account Number : 1001').should('exist');
    cy.contains('div', 'Balance : 5096').should('exist');
    cy.contains('div', 'Currency : Dollar').should('exist');
    // 7
    cy.contains('button', 'Deposit').click();
    // 8
    cy.get('input[placeholder="amount"]').type('2012');
    // 9
    cy.contains('button[type="submit"]', 'Deposit').click();
    // 10
    cy.contains('span', 'Deposit Successful').should('exist');
    // 11
    cy.contains('div', 'Balance : 7108').should('exist');
    // 12
    cy.contains('button', 'Withdrawl').click();
    cy.contains('button', 'Withdrawl').click();

    // 13
    // cy.get('input[placeholder="amount"]').type('1008');
    cy.get('form[ng-submit="withdrawl()"]').find('input').type('1008');
    // 14
    cy.contains('button[type="submit"]', 'Withdraw').click();
    // 15
    cy.contains('span', 'Transaction successful').should('exist');
    // 16
    cy.contains('div', 'Balance : 6100').should('exist');
    // 17
    cy.contains('button', 'Transactions').click();
    // 18
    cy.contains('a', 'Date-Time').click();
    cy.get('table tr')
      .eq(1)
      .contains('tr', '1008' + 'Debit')
      .should('exist');

    cy.get('table tr')
      .eq(2)
      .contains('tr', '2012' + 'Credit')
      .should('exist');

    // 19
    cy.contains('button', 'Back').click();

    // 20
    cy.get('select').select('1002');
    cy.contains('div', 'Account Number : 1002').should('exist');

    // 21
    cy.contains('button', 'Transactions').click();

    // 22
    cy.get('table').should('have.length', 1);

    // 23
    cy.contains('button', 'Logout').click();

    // 24
    cy.get('select[id="userSelect"]').should('exist');
  });
});
