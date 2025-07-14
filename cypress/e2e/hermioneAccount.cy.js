/// <reference types='cypress' />

describe('Bank app', () => {
  const depositAmount = 3000;
  const withdrawAmount = 3000;
  const balance = depositAmount - withdrawAmount;

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('button', 'Customer Login')
      .click();
    cy.get('#userSelect')
      .select('Hermoine Granger');
    cy.contains('button', 'Login')
      .click();

    cy.contains('.borderM .center', 'Account Number')
      .should('contain.text', '1001');
    cy.contains('.borderM .center', 'Balance')
      .contains('strong', balance)
      .should('be.visible');
    cy.contains('.borderM .center', 'Currency')
      .should('contain.text', 'Dollar');

    cy.contains('button', 'Deposit')
      .click();

    cy.get('[placeholder="amount"]')
      .type(depositAmount);
    cy.contains('[type="submit"]', 'Deposit')
      .click();
    cy.get('[ng-show="message"]')
      .should('contain', 'Deposit Successful');

    cy.contains('button', 'Withdrawl')
      .click();

    cy.contains('[type="submit"]', 'Withdraw')
      .should('be.visible');
    cy.get('[placeholder="amount"]')
      .type(withdrawAmount);
    cy.contains('[type="submit"]', 'Withdraw')
      .click();
    cy.get('[ng-show="message"]')
      .should('contain', 'Transaction successful');

    cy.contains('.borderM .center', 'Balance')
      .contains('strong', balance)
      .should('be.visible');

    cy.contains('button', 'Transactions')
      .click();
    cy.get('table tbody tr')
      .should('have.length', 0);

    cy.get('.logout')
      .click();
    cy.get('#userSelect')
      .should('be.visible');
  });
});
