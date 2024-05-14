/// <reference types='cypress' />

describe('Bank app', () => {
  const depositValue = 250;
  const withdrawValue = 40;
  const user = 'Hermoine Granger';
  const accountNumber = '1001';
  const startBalance = 5096;
  const endBalance = startBalance + depositValue;
  const date = '2024-04-25T00:00';

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('[name="userSelect"]').select(user);
    cy.contains('.btn', 'Login').click();

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
        .contains('strong', accountNumber)
        .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
        .contains('strong', startBalance)
        .should('be.visible');
    cy.contains('.ng-binding', 'Dollar')
        .should('be.visible');

    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type(depositValue);
    cy.contains('[type="submit"]', 'Deposit').click();

    cy.get('[ng-show="message"]').should('contain', 'Deposit Successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
        .contains('strong', endBalance)
        .should('be.visible');

    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw').should('be.visible');
    cy.get('[placeholder="amount"]').type(withdrawValue);
    cy.contains('[type="submit"]', 'Withdraw').click();

    cy.get('[ng-show="message"]')
        .should('contain', 'Transaction successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
        .contains('strong', endBalance - withdrawValue)
        .should('be.visible');

    cy.get('.btn').contains('Transactions').click();
    cy.get('#start').type(date);

    // Оновлена команда з збільшеним часом очікування:
    cy.get('tr').should('contain.text', 'Credit', { timeout: 10000 });

    cy.get('tr').should('contain.text', 'Debit');
    cy.contains('.btn', 'Back').click();
    cy.get('select').select('1002');
    cy.contains('[ng-hide="noAccount"]', 'Account Number')
        .contains('strong', '1002')
        .should('be.visible');
    cy.get('.btn').contains('Transactions').click();
    cy.get('anchor0').should('not.exist');
    cy.get('.btn').contains('Logout').click();
    cy.url().should('include', 'customer');
  });
});
