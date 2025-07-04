export default class TransactionsPageObject {
  clickTransactionsButton() {
    return cy
      .get('button[ng-click="transactions()"]')
      .contains('Transactions')
      .click();
  }

  verifyTransactionTableExists() {
    return cy.get('table').should('exist');
  }

  verifyTransactionTableHeader(header) {
    return cy.get('table thead tr th').should('contain', header);
  }

  verifyTransactionRowCount(count) {
    return cy.get('table tbody tr').should('have.length', count);
  }

  verifyBackButton() {
    return cy.get('button[ng-click="back()"]').should('exist');
  }

  verifyResetButton() {
    return cy.get('button[ng-click="reset()"]').should('exist');
  }
}
