/// <reference types='cypress' />

describe('Bank app', () => {
  before(() => {
    cy.visit('/');
  });
  const { generateNew } = require('../e2e/generate');

  const {
    user, deposit, accountNumber, currency, withdrawl
  } = generateNew();
  const firstBalance = 5096;
  const sumBalance = firstBalance + deposit;
  const afterWithdrawl = sumBalance - withdrawl;

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.get('.btn')
      .contains('Customer Login')
      .should('be.visible')
      .click();

    cy.get('#userSelect')
      .select(user);
    //  THIS TEST IS FAILED IF WE USE THE CORRECT NAME : Hermione Granger //
    // but actual we have Hermoine Granger //

    cy.get('.btn')
      .contains('Login')
      .should('be.visible')
      .click();

    cy.get('#accountSelect')
      .should('contain', accountNumber)
      .should('be.visible');

    cy.get('.ng-binding')
      .should('contain', currency)
      .should('be.visible');

    cy.get('[ng-class = "btnClass2"]')
      .contains('Deposit')
      .should('be.visible')
      .click();

    cy.byPlaceholder('amount')
      .should('be.visible')
      .type(deposit);

    cy.get('form.ng-dirty > .btn')
      .should('contain', 'Deposit')
      .click();

    cy.get('[ng-show ="message"]')
      .should('contain', 'Deposit Successful')
      .should('be.visible');

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .should('contain', sumBalance)
      .should('be.visible');

    cy.get('[ng-class="btnClass3"]')
      .should('contain', 'Withdrawl')
      .click();

    // I'VE USED THIS CHECK BEFOR TYPING BECAUSE: IF MESSAGE AFTER DEPOSIT STILL APPEARS
    // TEST FAILS WHEN FIRSTLY TRY TO TYPE THE VALUE (NEED TO DO IT TWICE) ---->
    cy.contains('[type="submit"]', 'Withdraw')
      .should('be.visible');

    cy.byPlaceholder('amount')
      .type(withdrawl);

    cy.get('[type = "submit"]')
      .should('contain', 'Withdraw')
      .click();

    cy.get('[ng-show ="message"]')
      .should('contain', 'Transaction successful')
      .should('be.visible');

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .should('contain', afterWithdrawl)
      .should('be.visible');

    cy.get('[ng-class="btnClass1"]')
      .should('contain', 'Transactions')
      .click();

    // SOMETIMES FAILED BECAUSE OF THE TIMEOUT (IF WANT TO SOLVE - CHANGE defaultCommandTimeout) //
    cy.get('td.ng-binding')
      .should('contain', deposit)
      .should('contain', withdrawl);

    cy.get('[ng-click="back()"]')
      .contains('Back')
      .should('be.visible')
      .click();

    cy.get('#accountSelect')
      .should('contain', '1002')
      .select('1002');

    cy.get('[ng-class="btnClass1"]')
      .should('contain', 'Transactions')
      .click();

    cy.get('td.ng-binding')
      .should('not.exist')
      .should('not.exist');

    cy.get('.logout')
      .should('be.visible')
      .click();

    cy.get('#userSelect')
      .should('be.visible');
  });
});
