describe('Wizard Bank - Hermione Granger Account', () => {
  const customerName = 'Hermione Granger';
  const depositAmount = 500;
  const withdrawAmount = 200;

  let initialBalance;
  let initialTransactionsCount;

  beforeEach(() => {
    cy.visit('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login');
  });

  it('should complete deposit, withdrawal and transaction verification flow', () => {
    // Customer Login
    cy.contains('button', 'Customer Login')
      .click();

    cy.get('#userSelect')
      .select(customerName);

    cy.contains('button', 'Login')
      .click();

    // Read initial balance dynamically
    cy.get('.borderM strong')
      .eq(1)
      .invoke('text')
      .then((text) => {
        initialBalance = Number(text);
      });

    // Go to transactions and read initial count
    cy.contains('button', 'Transactions')
      .click();

    cy.get('table tbody tr')
      .then((rows) => {
        initialTransactionsCount = rows.length;
      });

    cy.contains('button', 'Back')
      .click();

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
      .should('contain', initialBalance + depositAmount);

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
      .should('contain', initialBalance + depositAmount - withdrawAmount);

    // Transactions
    cy.contains('button', 'Transactions')
      .click();

    cy.get('table tbody tr')
      .should('have.length', initialTransactionsCount + 2);

    cy.get('table tbody tr')
      .last()
      .should('contain', withdrawAmount)
      .and('contain', 'Debit');

    // Back
    cy.contains('button', 'Back')
      .click();

    // Change account
    cy.get('#accountSelect')
      .select(1);

    // Transactions for another account
    cy.contains('button', 'Transactions')
      .click();

    cy.get('table tbody tr')
      .should('have.length', 0);

    // Logout
    cy.contains('button', 'Logout')
      .click();

    cy.contains('button', 'Customer Login')
      .should('be.visible');
  });
});
