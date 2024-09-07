/// <reference types='cypress' />

describe('Account withdrawal', () => {
  const now = new Date(2024, 0, 1).getTime();

  const fName = 'Hermoine Granger';
  const aNumber = '1001';
  const aBalance = '5096';
  const wAmount = '5100';

  before(() => {
    cy.visit('/');
  });

  it('should fail due to insufficient funds', () => {
    cy.clock(now);

    cy.get(`button[class='btn btn-primary btn-lg']`)
      .contains('Customer Login')
      .click();
    cy.get(`select[name='userSelect']`)
      .select(fName);
    cy.get(`button[type='submit']`)
      .click();

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', aNumber)
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', aBalance)
      .should('be.visible');
    cy.contains('.ng-binding', 'Dollar')
      .should('be.visible');

    cy.get(`button[ng-click='withdrawl()']`)
      .click();
    cy.get(`input[class='form-control ng-pristine ng-untouched ng-invali` +
      `d ng-invalid-required']`)
      .type(wAmount);
    cy.get(`button[type='submit']`)
      .contains('Withdraw')
      .click();
    cy.get(`span[class='error ng-binding']`)
      .contains('Transaction Failed. You can not withdraw amount more' +
      ' than the balance.')
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', aBalance)
      .should('be.visible');

    cy.get(`button[ng-click='byebye()']`)
      .click();
    cy.get(`select[name='userSelect']`)
      .should('be.visible');
  });
});
