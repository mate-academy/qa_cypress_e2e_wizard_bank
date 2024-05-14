/// <reference types='cypress' />

describe('Bank app', () => {
  const customerLoginBtn = 'Customer Login';
  const user = 'Hermoine Granger';
  const depositAmount = 175;
  const withdrawAmount = 250;
  const originalBalance = 5096;
  const afterDeposit = depositAmount + originalBalance;
  const afterWithdrawl = afterDeposit - withdrawAmount;
  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione_s bank account', () => {
    cy.contains('.btn', customerLoginBtn).click();
    cy.url().should('contain', 'customer');
    cy.get('#userSelect').select(user);
    cy.get('[type="submit"]').click();

    cy.get('.fontBig').should('contain', user);
    cy.get('#accountSelect').should('contain.text', '1001');
    cy.contains('[ng-hide="noAccount"]', originalBalance)
      .should('contain', originalBalance);

    cy.contains('.ng-binding', 'Dollar').should('be.visible');
    cy.get('[ng-click="deposit()"]').click();
    cy.findByPlaceholder('amount').should('be.visible').type(depositAmount);
    cy.contains('[type="submit"]', 'Deposit').click();
    cy.get('[ng-show="message"]').should('contain', 'Deposit Successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .should('contain', afterDeposit);

    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw').should('be.visible');

    cy.get('[placeholder="amount"]').type(withdrawAmount);
    cy.contains('[type="submit"]', 'Withdraw').click();
    cy.get('[ng-show ="message"]')
      .should('contain', 'Transaction successful')
      .should('be.visible');

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .should('contain', afterWithdrawl);

    cy.contains('Transactions').click();
    cy.get('td.ng-binding')
      .should('contain', depositAmount)
      .should('contain', withdrawAmount);

    cy.contains('Back').click();

    cy.get('#accountSelect').should('contain', '1003').select('1003');
    cy.contains('Transactions').click();
    cy.get('td.ng-binding').should('not.exist');

    cy.get('[ng-show="logout"]').click();
    cy.get('#userSelect').should('be.visible');
  });
});
