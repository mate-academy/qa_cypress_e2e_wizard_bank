/// <reference types='cypress' />

describe('Hermione Granger - Wizard Bank Flow', () => {
  const depositAmount = 500;
  const withdrawAmount = 200;
  let initialBalance;

  it('should perform full transaction flow for Hermione', () => {
    cy.visit('https://www.globalsqa.com/angJs-protractor/BankProject/#/login');

    cy.contains('Customer Login').click();

    cy.get('select').select('Hermione Granger');
    cy.get('button[type="submit"]').click();

    cy.get('.center strong').eq(0).should('contain', '1001');

    cy.get('.center strong').eq(1).invoke('text').then((text) => {
      initialBalance = parseFloat(text);
    });

    cy.get('.center strong').eq(2).should('contain', 'Dollar');

    cy.contains('Deposit').click();
    cy.get('input[placeholder="amount"]').type(depositAmount.toString());
    cy.get('form button').click();
    cy.get('.error').should('contain', 'Deposit Successful');

    cy.get('.center strong').eq(1).should(($balance) => {
      const newBalance = parseFloat($balance.text());
      expect(newBalance).to.equal(initialBalance + depositAmount);
    });

    cy.contains('Withdrawl').click();
    cy.get('input[placeholder="amount"]').type(withdrawAmount.toString());
    cy.get('form button').click();
    cy.get('.error').should('contain', 'Transaction successful');

    cy.get('.center strong').eq(1).should(($balance) => {
      const afterWithdrawal = parseFloat($balance.text());
      expect(afterWithdrawal).to
        .equal(initialBalance + depositAmount - withdrawAmount);
    });

    cy.contains('Transactions').click();
    cy.get('tr').should('have.length.greaterThan', 2);
    cy.get('tr').eq(1).should('contain', depositAmount);
    cy.get('tr').eq(2).should('contain', withdrawAmount);

    cy.contains('Back').click();
    cy.get('select').select('1002');
    cy.contains('Transactions').click();
    cy.get('tr').should('have.length', 1);

    cy.contains('Logout').click();
    cy.url().should('include', '/login');
    cy.contains('Your Name :').should('exist');
  });
});
