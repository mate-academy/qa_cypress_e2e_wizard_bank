/// <reference types='cypress' />
import { faker } from '@faker-js/faker';

describe('Withdrawal limits', () => {
  beforeEach(() => {
    cy.clock(Date.UTC(2026, 0, 1, 12), ['Date']);
    cy.visit('/#/login');
    cy.contains('button', 'Customer Login').click();
    cy.get('#userSelect').select('Hermoine Granger');
    cy.contains('button', /^Login$/).click();
    cy.get('[ng-click="transactions()"]').click();
    cy.contains('button', 'Reset').click();
    cy.get('tbody tr').should('not.exist');
    cy.contains('button', 'Back').click();
  });

  it('rejects an overdraft and allows withdrawing the entire balance', () => {
    const depositAmount = faker.number.int({ min: 500, max: 1000 });
    const overdraft = depositAmount + faker.number.int({ min: 1, max: 100 });
    const balance = '[ng-hide="noAccount"] strong';

    cy.get(balance).eq(1).invoke('text').invoke('trim').should('eq', '0');
    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type(String(depositAmount));
    cy.contains('button[type="submit"]', 'Deposit').click();
    cy.get(balance).eq(1)
      .invoke('text').invoke('trim').should('eq', String(depositAmount));

    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('button[type="submit"]', 'Withdraw').should('be.visible');
    cy.get('[placeholder="amount"]').type(String(overdraft));
    cy.contains('button[type="submit"]', 'Withdraw').click();
    cy.get('[ng-show="message"]').should('be.visible')
      .invoke('text').invoke('trim').should('eq',
        'Transaction Failed. You can not withdraw amount ' +
        'more than the balance.');
    cy.get(balance).eq(1)
      .invoke('text').invoke('trim').should('eq', String(depositAmount));
    cy.get('[ng-click="transactions()"]').click();
    cy.get('tbody tr').should('have.length', 1);
    cy.get('tbody tr').first().within(() => {
      cy.get('td').eq(1)
        .invoke('text').invoke('trim').should('eq', String(depositAmount));
      cy.get('td').eq(2).invoke('text').invoke('trim').should('eq', 'Credit');
    });

    cy.contains('button', 'Back').click();
    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('button[type="submit"]', 'Withdraw').should('be.visible');
    cy.get('[placeholder="amount"]').clear();
    cy.get('[placeholder="amount"]').type(String(depositAmount));
    cy.contains('button[type="submit"]', 'Withdraw').click();
    cy.get('[ng-show="message"]')
      .should('be.visible')
      .invoke('text').invoke('trim').should('eq', 'Transaction successful');
    cy.get(balance).eq(1).invoke('text').invoke('trim').should('eq', '0');
    cy.get('[ng-click="transactions()"]').click();
    cy.get('tbody tr').should('have.length', 2);
    cy.get('tbody tr').last().within(() => {
      cy.get('td').eq(1)
        .invoke('text').invoke('trim').should('eq', String(depositAmount));
      cy.get('td').eq(2).invoke('text').invoke('trim').should('eq', 'Debit');
    });
  });
});
