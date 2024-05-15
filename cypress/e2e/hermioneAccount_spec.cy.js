/// <reference types='cypress' />

describe('Bank app', () => {
  const customerLoginBtn = 'Customer Login';
  const user = 'Hermoine Granger';
  const accountNumber = '1001';
  const placeAccountNumber = 1;

  const placeBalanse = 2;
  const balance = 5096;

  const placeCurrency = 3;
  const currency = 'Dollar';

  const depositAmount = 50;
  const balanceDeposit = balance + depositAmount;

  const amountWithdraw = 50;
  const amountAfterWithdraw = balanceDeposit - amountWithdraw;

  beforeEach(() => {
    cy.visit('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('.btn', customerLoginBtn).click();
    cy.get('#userSelect').select(user);
    cy.get('[type="submit"]').click();

    cy.contains('.center', 'Account Number')
      .contains('strong', accountNumber)
      .should('be.visible');

    cy.numberBalanseCurrency(placeAccountNumber)
      .should('contain', accountNumber);
    cy.numberBalanseCurrency(placeBalanse).should('contain', balance);
    cy.numberBalanseCurrency(placeCurrency).should('contain', currency);

    cy.contains('.center', 'Deposit').click();
    cy.findByPlaceholder('amount').type(depositAmount);
    cy.get('[type="submit"], Deposit').click();

    cy.get('[ng-show="message"]')
      .should('contain', 'Deposit Successful');
    cy.numberBalanseCurrency(placeBalanse).should('contain', balanceDeposit);

    cy.get('[ng-click="withdrawl()"]').click();
    cy.get('[placeholder="amount"]').click();
    cy.get('[ng-click="withdrawl()"]').click();
    cy.get('[placeholder="amount"]').type(amountWithdraw);
    cy.get('.btn-default').click();

    cy.get('.error').should('contain', 'Transaction successful');
    cy.numberBalanseCurrency(placeBalanse)
      .should('contain', amountAfterWithdraw);

    cy.get('[ng-click="transactions()"]').click();
    cy.get('td.ng-binding')
      .should('contain', 'Debit')
      .should('contain', 'Credit');

    cy.contains('.btn', 'Back').click();

    cy.get('#accountSelect').select('1002');
    cy.get('[ng-click="transactions()"]').click();
    cy.get('#anchor0').should('not.exist');

    cy.get('[ng-show="logout"]').click();
    cy.get('#userSelect').should('exist');
  });
});
