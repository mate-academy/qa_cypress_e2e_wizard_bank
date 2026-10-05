/// <reference types='cypress' />

describe('Bank app', () => {
  before(() => {
    // Whole-minute dates avoid the demo's date filter truncating seconds.
    cy.clock(Date.UTC(2026, 0, 1, 12), ['Date']);
    cy.visit('/#/login');
    // The demo seeds this account with historical transactions and a balance.
    cy.contains('button', 'Customer Login').click();
    cy.get('#userSelect').select('Hermoine Granger');
    cy.contains('button', /^Login$/).click();
    cy.get('[ng-click="transactions()"]').click();
    cy.contains('button', 'Reset').click();
    cy.get('tbody tr').should('not.exist');
    cy.contains('button', 'Logout').click();
    cy.contains('button', 'Home').click();
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    const depositAmount = 1000;
    const withdrawAmount = 250;
    const accountDetails = '[ng-hide="noAccount"] strong';

    cy.contains('button', 'Customer Login').click();
    // The demo spells Hermione's first name as "Hermoine".
    cy.get('#userSelect').select('Hermoine Granger');
    cy.contains('button', /^Login$/).click();
    cy.get('.fontBig')
      .invoke('text').invoke('trim').should('eq', 'Hermoine Granger');
    cy.get('#accountSelect option:selected')
      .invoke('text').invoke('trim').should('eq', '1001');
    cy.get(accountDetails).eq(0)
      .invoke('text').invoke('trim').should('eq', '1001');
    cy.get(accountDetails).eq(1)
      .invoke('text').invoke('trim').should('eq', '0');
    cy.get(accountDetails).eq(2)
      .invoke('text').invoke('trim').should('eq', 'Dollar');

    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type(String(depositAmount));
    cy.contains('button[type="submit"]', 'Deposit').click();
    cy.get('[ng-show="message"]')
      .should('be.visible')
      .invoke('text').invoke('trim').should('eq', 'Deposit Successful');
    cy.get(accountDetails).eq(1)
      .invoke('text').invoke('trim').should('eq', String(depositAmount));

    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('button[type="submit"]', 'Withdraw').should('be.visible');
    cy.get('[placeholder="amount"]').type(String(withdrawAmount));
    cy.contains('button[type="submit"]', 'Withdraw').click();
    cy.get('[ng-show="message"]')
      .should('be.visible')
      .invoke('text').invoke('trim').should('eq', 'Transaction successful');
    cy.get(accountDetails).eq(1)
      .invoke('text').invoke('trim')
      .should('eq', String(depositAmount - withdrawAmount));

    cy.get('[ng-click="transactions()"]').click();
    cy.get('tbody tr').should('have.length', 2);
    cy.get('tbody tr').eq(0).within(() => {
      cy.get('td').eq(0).invoke('text').should((date) => {
        expect(Date.parse(date)).to.equal(Date.UTC(2026, 0, 1, 12));
      });
      cy.get('td').eq(1)
        .invoke('text').invoke('trim').should('eq', String(depositAmount));
      cy.get('td').eq(2).invoke('text').invoke('trim').should('eq', 'Credit');
    });
    cy.get('tbody tr').eq(1).within(() => {
      cy.get('td').eq(0).invoke('text').should((date) => {
        expect(Date.parse(date)).to.equal(Date.UTC(2026, 0, 1, 12));
      });
      cy.get('td').eq(1)
        .invoke('text').invoke('trim').should('eq', String(withdrawAmount));
      cy.get('td').eq(2).invoke('text').invoke('trim').should('eq', 'Debit');
    });

    cy.contains('button', 'Back').click();
    cy.get('#accountSelect').select('1002');
    cy.get(accountDetails).eq(0)
      .invoke('text').invoke('trim').should('eq', '1002');
    cy.get('[ng-click="transactions()"]').click();
    cy.get('table').should('be.visible');
    cy.get('tbody tr').should('not.exist');

    cy.contains('button', 'Logout').click();
    cy.location('hash').should('eq', '#/customer');
    cy.get('#userSelect').should('be.visible').and('have.value', '');
    cy.contains('button', 'Logout').should('not.be.visible');
    cy.get('#accountSelect').should('not.exist');
  });
});
