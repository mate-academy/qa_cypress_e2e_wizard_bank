describe('Wizard Bank - Hermione Granger Account', () => {
  const customerName = 'Hermione Granger';
  const depositAmount = 500;
  const withdrawAmount = 200;

  beforeEach(() => {
    cy.visit('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login');
  });

  it('should complete deposit, withdrawal and transaction verification flow', () => {
    // Customer Login
    cy.contains('button', 'Customer Login')
      .click();

    // Select customer
    cy.get('#userSelect')
      .select(customerName);

    cy.contains('button', 'Login')
      .click();

    // Assertions: Account info
    cy.get('.borderM strong')
      .eq(0)
      .should('contain', '1001'); // Account Number

    cy.get('.borderM strong')
      .eq(1)
      .should('contain', '0'); // Balance

    cy.get('.borderM strong')
      .eq(2)
      .should('contain', 'Dollar'); // Currency

    // Deposit
    cy.contains('button', 'Deposit')
      .click();

    cy.get('input[ng-model="amount"]')
      .type(depositAmount);

    cy.contains('button', 'Deposit')
      .click();

    cy.get('.error')
      .should('contain', 'Deposit Successful');

    cy.get('.borderM strong')
      .eq(1)
      .should('contain', depositAmount);

    // Withdraw
    cy.contains('button', 'Withdrawl')
      .click();

    cy.get('input[ng-model="amount"]')
      .clear()
      .type(withdrawAmount);

    cy.contains('button', 'Withdraw')
      .click();

    cy.get('.error')
      .should('contain', 'Transaction successful');

    cy.get('.borderM strong')
      .eq(1)
      .should('contain', depositAmount - withdrawAmount);

    // Transactions
    cy.contains('button', 'Transactions')
      .click();

    cy.get('table tbody tr')
      .should('have.length', 2);

    cy.get('table tbody tr')
      .eq(0)
      .should('contain', depositAmount)
      .and('contain', 'Credit');

    cy.get('table tbody tr')
      .eq(1)
      .should('contain', withdrawAmount)
      .and('contain', 'Debit');

    // Back
    cy.contains('button', 'Back')
      .click();

    // Change account
    cy.get('#accountSelect')
      .select(1); // switch to another account

    // Transactions for another account
    cy.contains('button', 'Transactions')
      .click();

    cy.get('table tbody tr')
      .should('have.length', 0);

    // Logout
    cy.contains('button', 'Logout')
      .click();

    cy.url()
      .should('include', '/login');

    cy.contains('button', 'Customer Login')
      .should('be.visible');
  });
});
