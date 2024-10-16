
/// <reference types='cypress' />

describe('Bank app', () => {
  let balance;
  const fullName = 'Hermoine Granger';
  const accountNumber = '1001';
  const currency = 'Dollar';

  const depositAmount = '200';
  const withdrawAmount = '100';

  const depositSuccessMessage = 'Deposit Successful';
  const withdrawlSuccessMessage = 'Transaction successful';

  beforeEach(() => cy
    .visit('baseUrl'));
  it('should allow wizzard to login and view transactions', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('#userSelect').select(fullName);
    cy.get('button[type="submit"]').click();
    cy.get('#accountSelect').should('contain', accountNumber);
    cy.get('.borderM > :nth-child(3) > :nth-child(2)')
      .invoke('text').then((text) => {
        cy.log(`${text}`);

        balance = text;
        const balanceAfterDeposit = (+balance + +depositAmount)
          .toString();
        const balanceAfterWithdrawl = (+balanceAfterDeposit - +withdrawAmount)
          .toString();

        cy.get('.borderM > :nth-child(3) > :nth-child(3)')
          .should('contain', currency);
        cy.contains('.btn', 'Deposit ').click();
        cy.get('[placeholder="amount"]').type(`${depositAmount}{enter}`);
        cy.contains('.ng-binding', depositSuccessMessage)
          .should('exist').and('be.visible');
        cy.get('.borderM > :nth-child(3)')
          .should('contain', balanceAfterDeposit);

        cy.contains('.btn', 'Transactions ').click();
        cy.contains('.btn', 'Back')
          .click();

        cy.contains('.btn', 'Withdrawl').click();
        cy.get('[placeholder="amount"]')
          .type(withdrawAmount);
        cy.get('[placeholder="amount"]')
          .should('have.value', withdrawAmount).type('{enter}');
        cy.contains('.ng-binding', withdrawlSuccessMessage)
          .should('exist').and('be.visible');
        cy.get('.borderM > :nth-child(3)')
          .should('contain', balanceAfterWithdrawl);

        cy.reload();

        cy.contains('.btn', 'Transactions ').click();

        cy.contains('tr', 'Credit').should('contain', depositAmount);
        cy.contains('tr', 'Debit').should('contain', withdrawAmount);

        cy.contains('.btn', 'Back').click();

        cy.get('.logout').click();
        cy.get('#userSelect').should('be.visible');
      });
  });
});
