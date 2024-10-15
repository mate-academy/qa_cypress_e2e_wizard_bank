/// <reference types="cypress" />
describe('Hermione Granger Account Flow', () => {
  it('Should log in as Hermione Granger and perform deposit and withdrawal',
    () => {
      cy.visit(
        'https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login'
      );
      cy.contains('Customer Login', { timeout: 10000 })
        .should('be.visible');

      cy.contains('Customer Login').click();

      cy.get('select').select('Hermoine Granger');

      cy.contains('Login').should('be.visible').click();

      cy.contains('Account Number').parent().should('contain', '1001');

      cy.get('strong.ng-binding').should('contain', '5096');

      cy.get('strong.ng-binding').contains('Dollar').should('be.visible');

      cy.contains('Deposit').click();
      cy.get('input[placeholder="amount"]').type('100');
      cy.contains('Deposit').click();

      cy.get('span.error.ng-binding[ng-show="message"]', { timeout: 10000 })
        .should('not.have.class', 'ng-hide')
        .and('contain', 'Deposit Successful');

      cy.get('div.center').should('contain', '5196');

      cy.contains('Withdraw').click();
      cy.get('input[placeholder="amount"]').type('100');
      cy.contains('Withdraw').click();

      cy.get('span.error.ng-binding[ng-show="message"]', { timeout: 10000 })
        .should('not.have.class', 'ng-hide')
        .and('be.visible')
        .and('contain', 'Transaction successful');

      cy.get('strong.ng-binding').eq(1).should('contain', '5096');

      cy.contains('Transactions').click();

      cy.contains('Back').should('be.visible').click();

      cy.get('select').select('1002');

      cy.contains('Transactions').click();
      cy.get('tbody tr').should('have.length', 0);

      cy.contains('Logout').should('be.visible').click();
    });
});
