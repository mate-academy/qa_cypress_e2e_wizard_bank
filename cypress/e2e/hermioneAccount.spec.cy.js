/// <reference types='cypress' />

describe('Bank app', () => {
  const name = 'Hermoine Granger';
  const number = '1001';
  const anotherNumber = '1002';
  let balance;
  const currency = 'Dollar';

  const deposit = '1000';
  const withdrawl = '35';

  const depositSuccess = 'Deposit Successful';
  const withdrawlSuccess = 'Transaction successful';
  before(() => {
    cy.visit('');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('#userSelect').select(name);
    cy.get('[type="submit"]').click();
    cy.get('#accountSelect').should('contain', number);

    cy.contains('.btn', 'Transactions ').click();
    cy.contains('.btn', 'Reset').click();
    cy.contains('.btn', 'Back').click();

    cy.get('.borderM > :nth-child(3) > :nth-child(2)')
      .invoke('text').then((text) => {
        balance = text;
        const balanceAfterDeposit = (+balance + +deposit).toString();
        const balanceAfterWith = (+balanceAfterDeposit - +withdrawl).toString();

        cy.contains('.ng-binding', currency).should('be.visible');
        cy.contains('.btn', 'Deposit ').click();
        cy.get('[placeholder="amount"]').type(deposit);
        cy.get('[type="submit"]').click();
        cy.get('.error').should('contain', depositSuccess);
        cy.get('.borderM > :nth-child(3) > :nth-child(2)')
          .should('contain', balanceAfterDeposit);

        cy.contains('.btn', 'Transactions ').click();
        cy.contains('.btn', 'Back').click();

        cy.contains('.btn', 'Withdrawl ').click();
        cy.get('[placeholder="amount"]').type(withdrawl);
        cy.get('[type="submit"]').click();
        cy.get('.error').should('contain', withdrawlSuccess);
        cy.get('.borderM > :nth-child(3) > :nth-child(2)')
          .should('contain', balanceAfterWith);

        cy.reload();

        cy.contains('.btn', 'Transactions ').click();

        cy.contains('tr', 'Credit').should('contain', deposit);
        cy.contains('tr', 'Debit').should('contain', withdrawl);
        cy.contains('.btn', 'Back').click();

        cy.get('#accountSelect').select(anotherNumber);
        cy.contains('.btn', 'Transactions ').click();
        cy.contains('tr', 'Credit').should('not.exist');
        cy.contains('tr', 'Debit').should('not.exist');

        cy.get('.logout').click();
        cy.get('#userSelect').should('exist');
      });
  });
});
