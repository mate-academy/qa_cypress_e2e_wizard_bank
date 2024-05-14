/// <reference types='cypress' />
describe('Bank app', () => {
  const accountNumber2 = '1002';
  const accountNumber = '1001';
  const balance = '5096';
  const depositToAdd = '100';
  const expectedBalance = (+balance + 100).toString();
  const withdraw = '500';
  const expectedBalance2 = (+expectedBalance - 500).toString();

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('[name="userSelect"]').select('Hermoine Granger');
    cy.contains('.btn', 'Login').click();
    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', accountNumber)
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balance)
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Currency')
      .contains('strong', 'Dollar')
      .should('be.visible');

    cy.get('[ng-class="btnClass2"]').click();
    cy.get('[placeholder="amount"]').type(depositToAdd);
    cy.get('form.ng-dirty > .btn').click();
    cy.get('[ng-show="message"]')
      .should('contain', 'Deposit Successful');

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', expectedBalance)
      .should('be.visible');

    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw')
      .should('be.visible');
    cy.get('[placeholder="amount"]').type(withdraw);
    cy.contains('[type="submit"]', 'Withdraw').click();
    cy.get('[ng-show="message"]')
      .should('contain', 'Transaction successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', expectedBalance2)
      .should('be.visible');

    cy.get('[ng-class="btnClass1"]').click();

    cy.get('.fixedTopBox > [style="float:left"]').click();
    cy.get('#accountSelect').select(accountNumber2);
    cy.get('[ng-class="btnClass1"]').click();
    cy.get('td.ng-binding').should('not.exist');

    cy.get('.logout').click();
    cy.contains('label', 'Your Name')
      .should('contains.text', 'Your Name');
  });
});
