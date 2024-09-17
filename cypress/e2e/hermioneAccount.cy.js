/// <reference types='cypress' />
import { getRandomNum } from '../support/random';

describe('Bank app', () => {
  before(() => {
    cy.visit(
      'https://www.globalsqa.com/angularJs-protractor/' +
      'BankingProject/#/login'
    );
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    const today = new Date();
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = today.toLocaleString('en-US', options);
    const defaultAmount = 5096;
    const deposit = getRandomNum(1, 100);
    const withdraw = getRandomNum(1, 100);

    cy.contains('button', 'Customer Login')
      .click();

    cy.get('[name="userSelect"]')
      .select('Hermoine Granger');

    cy.contains('button', 'Login')
      .click();

    cy.get('div.ng-scope div:nth-child(3) strong')
      .should('contain', '1001');

    cy.get('div.ng-scope div:nth-child(3) strong:nth-child(2)')
      .should('contain', defaultAmount);

    cy.get('div.ng-scope div:nth-child(3) strong:nth-child(3)')
      .should('contain', 'Dollar');

    cy.contains('button', 'Deposit')
      .click();

    cy.contains('[type="submit"]', 'Deposit')
      .should('be.visible');

    cy.get('[placeholder="amount"]')
      .type(deposit);

    cy.get('button.btn.btn-default')
      .contains('Deposit')
      .click();

    cy.contains('span', 'Deposit Successful')
      .should('be.visible');

    cy.get('div.ng-scope div:nth-child(3) strong:nth-child(2)')
      .should('contain', defaultAmount + deposit);

    cy.get('[ng-click="withdrawl()"]')
      .click();

    cy.contains('[type="submit"]', 'Withdraw')
      .should('be.visible');

    cy.get('[placeholder="amount"]')
      .type(withdraw);

    cy.contains('[type="submit"]', 'Withdraw')
      .click();

    cy.contains('span', 'Transaction successful')
      .should('be.visible');

    cy.get('div.ng-scope div:nth-child(3) strong:nth-child(2)')
      .should('contain', defaultAmount + deposit - withdraw);

    cy.contains('Transactions')
      .click();

    cy.get('table').within(() => {
      cy.contains('Debit').should('exist');
      cy.contains('Credit').should('exist');
      cy.contains(deposit).should('exist');
      cy.contains(withdraw).should('exist');
      cy.contains(formattedDate).should('exist');
    });

    cy.contains('button', 'Back')
      .click();

    cy.get('[name="accountSelect"]')
      .select('1002');

    cy.contains('Transactions')
      .click();

    cy.get('table').within(() => {
      cy.contains('Debit').should('not.exist');
      cy.contains('Credit').should('not.exist');
      cy.contains(deposit).should('not.exist');
      cy.contains(withdraw).should('not.exist');
      cy.contains(formattedDate).should('not.exist');
    });

    cy.contains('button', 'Logout')
      .click();

    cy.get('#userSelect')
      .should('have.value', '');
  });
});
