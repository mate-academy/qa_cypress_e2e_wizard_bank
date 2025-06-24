/// <reference types='cypress' />
const { generateUserData } = require('../support/generateUserData');

describe('Bank application', () => {
  let userData;
  let inputAmount;
  let newBalance;

  before(() => {
    userData = generateUserData();
    inputAmount = userData.inputMoneyAmount;
    cy.visit('/');
  });

  it('should provide the ability to work with the bank account', () => {
    cy.get('.btn.btn-primary.btn-lg').should('contain.text', 'Customer Login');
    cy.contains('button', 'Customer Login').click();

    cy.get('#userSelect').select('Ron Weasly');
    cy.contains('button', 'Login').click();

    cy.get('strong.ng-binding').eq(0).should('be.visible');
    cy.get('strong.ng-binding').eq(1).should('be.visible');
    cy.get('strong.ng-binding').eq(2).should('be.visible');

    cy.get('strong.ng-binding').eq(1).invoke('text').then((startAmount) => {
      const oldBalance = parseInt(startAmount);

      cy.contains('button', 'Deposit').click();
      cy.contains('Amount to be Deposited').should('be.visible');
      cy.get('input[ng-model="amount"]')
        .should('exist')
        .should('be.visible')
        .should('not.be.disabled')
        .type(`${inputAmount}{enter}`);

      cy.get('.error.ng-binding').should('contain.text', 'Deposit Successful');

      cy.get('strong.ng-binding').eq(1).invoke('text')
        .should((finishAmount) => {
          newBalance = parseInt(finishAmount);
          expect(newBalance).to.equal(oldBalance + inputAmount);
        });
    });

    cy.then(() => {
      cy.get('strong.ng-binding').eq(1).invoke('text').then(() => {
        cy.contains('button', 'Withdrawl').click();
        cy.contains('Amount to be Withdrawn').should('be.visible');
        cy.get('input[ng-model="amount"]')
          .should('exist')
          .should('be.visible')
          .should('not.be.disabled')
          .type(`${inputAmount}{enter}`);

        cy.get('.error.ng-binding', { timeout: 5000 })
          .should('contain.text', 'Transaction successful');

        cy.get('strong.ng-binding').eq(1).invoke('text')
          .should((finishAmount2) => {
            const finishBalance = parseInt(finishAmount2);
            expect(finishBalance).to.equal(newBalance - inputAmount);
          });
      });
    });

    cy.get('[ng-click="transactions()"]').click();
    cy.contains('Deposit').should('be.visible');
    cy.contains('Withdraw').should('be.visible');
    cy.get('[ng-click="back()"]').click();

    cy.get('#accountSelect').should('be.visible');
    cy.get('select').select('number:1009');
    cy.contains('button', 'Transactions').click();
    cy.get('tbody tr').should('not.exist');
    cy.contains('button', 'Logout').click();
    cy.get('#userSelect').should('have.value', '');
  });
});
