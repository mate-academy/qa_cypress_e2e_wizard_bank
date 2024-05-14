/// <reference types='cypress' />

describe('Wizard bank app', () => {
  const user = 'Hermoine Granger';
  const accountNumber = '1001';
  const currency = 'Dollar';
  const depositBtn = 'Deposit';
  const balance = 5096;
  const depositAmount = 100;
  const withdrawAmount = 50;
  const balanceDeposit = +balance + depositAmount;

  beforeEach(() => {
    cy.visit('/');
  });
  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.url().should('include', 'customer');
    cy.get('#userSelect').select(user);
    cy.get('[type="submit"]').click();
    cy.get('.fontBig').should('contain', user);

    cy.get('.ng-binding')
      .should('contains.text', accountNumber)
      .should('be.visible');

    cy.get('.ng-binding')
      .should('contains.text', balance)
      .should('be.visible');

    cy.get('.ng-binding')
      .should('contains.text', currency)
      .should('be.visible');

    cy.contains('.btn', depositBtn).click();
    cy.get('[placeholder="amount"]').type(depositAmount);
    cy.contains('[type="submit"]', depositBtn).click();
    cy.contains('.error', 'Deposit Successful').should('be.visible');

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balanceDeposit)
      .should('be.visible');

    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw').should('be.visible');
    cy.get('[placeholder="amount"]').type(withdrawAmount);
    cy.contains('[type="submit"]', 'Withdraw').click();
    cy.get('[ng-show="message"]').should('contain', 'Transaction successful');

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balanceDeposit - withdrawAmount)
      .should('be.visible');

    cy.get('[ng-click="transactions()"]').click();

    cy.get('[ng-click="back()"]').click();

    cy.get('#accountSelect').select('1002');

    cy.get('[ng-click="transactions()"]').click();
    cy.get('td.ng-binding')
      .should('not.exist')
      .should('not.exist');

    cy.get('[ng-click="byebye()"]').click();
    cy.get('label').should('contain', 'Your Name :');
    cy.url().should('include', 'customer');
  });
});
