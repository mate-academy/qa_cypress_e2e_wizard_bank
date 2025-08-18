// hermione.spec.js

describe('GlobalsQa Bank Flow - Hermione Granger', () => {
  beforeEach(() => {
    cy.visit(
      'https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login'
    );
  });

  it('should complete deposit and withdrawal for Hermione Granger', () => {
    // Login as Hermione Granger
    cy.contains('Customer Login').click();
    cy.get('#userSelect').select('Hermione Granger');
    cy.get('button[type=\'submit\']').click();

    // Assert account details
    cy.get('.center strong:nth-child(1)').should('contain.text', '1001'); // Account Number
    cy.get('.center strong:nth-child(2)')
      .invoke('text')
      .then((balanceText) => {
        expect(Number(balanceText)).to.be.a('number'); // Balance numeric
      });
    cy.get('.center strong:nth-child(3)').should('contain.text', 'Dollar'); // Currency

    // Deposit money
    cy.contains('Deposit').click();
    cy.get('input[ng-model=\'amount\']').type('100');
    cy.get('form button[type=\'submit\']').click();
    cy.get('.error').should('contain.text', 'Deposit Successful');
    cy.get('.center strong:nth-child(2)').should('contain.text', '100');

    // Withdraw money
    cy.contains('Withdrawl').click();
    cy.get('input[ng-model=\'amount\']').type('50');
    cy.get('form button[type=\'submit\']').click();
    cy.get('.error').should('contain.text', 'Transaction successful');
    cy.get('.center strong:nth-child(2)').should('contain.text', '50');

    // Check Transactions (deposit + withdraw)
    cy.contains('Transactions').click();
    cy.get('table tbody tr').should('have.length', 2);
    cy.get('table tbody tr').first().should('contain.text', 'Credit');
    cy.get('table tbody tr').last().should('contain.text', 'Debit');

    // Switch account
    cy.contains('Back').click();
    cy.get('#accountSelect').select('1002');
    cy.contains('Transactions').click();
    cy.get('table tbody tr').should('have.length', 0);

    // Logout
    cy.contains('Logout').click();
    cy.get('button[ng-click=\'customer()\']').should('be.visible');
  });
});
