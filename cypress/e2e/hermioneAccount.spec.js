describe('Hermione Granger banking flow', () => {
  const depositAmount = 1000;
  const withdrawAmount = 500;

  before(() => {
    cy.visit(
      'https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login'
    );
  });

  it('should complete full banking flow', () => {
    // Customer login
    cy.contains('Customer Login').click();
    cy.get('#userSelect').select('Hermione Granger');
    cy.contains('Login').click();

    // Account details assertions
    cy.get('.borderM strong')
      .eq(0)
      .invoke('text')
      .should('match', /\d+/);

    cy.get('.borderM strong')
      .eq(1)
      .should('contain.text', '0');

    cy.get('.borderM strong')
      .eq(2)
      .should('contain.text', 'Dollar');

    // Deposit
    cy.contains('Deposit').click();
    cy.get('input[placeholder="amount"]').type(depositAmount);
    cy.get('button[type="submit"]').click();

    cy.get('.error')
      .should('be.visible')
      .and('contain.text', 'Deposit Successful');

    cy.get('.borderM strong')
      .eq(1)
      .should('contain.text', depositAmount);

    // Withdraw
    cy.contains('Withdrawl').click();
    cy.get('input[placeholder="amount"]').type(withdrawAmount);
    cy.get('button[type="submit"]').click();

    cy.get('.error')
      .should('be.visible')
      .and('contain.text', 'Transaction successful');

    cy.get('.borderM strong')
      .eq(1)
      .should('contain.text', depositAmount - withdrawAmount);

    // Transactions
    cy.contains('Transactions').click();

    cy.get('table tbody tr')
      .should('have.length.at.least', 2);

    // Most recent transaction - Withdraw
    cy.get('table tbody tr')
      .eq(0)
      .within(() => {
        cy.get('td').eq(1).should('contain.text', withdrawAmount);
        cy.get('td').eq(2).should('contain.text', 'Debit');
      });

    // Earlier transaction - Deposit
    cy.get('table tbody tr')
      .eq(1)
      .within(() => {
        cy.get('td').eq(1).should('contain.text', depositAmount);
        cy.get('td').eq(2).should('contain.text', 'Credit');
      });

    // Back and change account
    cy.contains('Back').click();
    cy.get('#accountSelect').select(1);

    cy.contains('Transactions').click();
    cy.get('table tbody tr').should('have.length', 0);

    // Logout
    cy.contains('Logout').click();
    cy.url().should('include', '/login');
    cy.contains('Customer Login').should('be.visible');
  });
});
