/// <reference types='cypress' />

export default class TransactionsPageObj {
  clickTableHead(elType, cellName) {
    return cy.contains(elType, cellName)
      .should('be.visible')
      .click();
  }

  /**
   * Assert table cell value by row selector and 0-based column index.
   * @param {string} row - CSS selector for the table row (e.g., 'tr#anchor0')
   * @param {number} columnNo - Zero-based column index (e.g., 0 for first column)
   * @param {string|number} value - Expected cell value
   */
  assertTableRowData(row, columnNo, value) {
    return cy.get(row).within(() => {
      cy.get('td').eq(columnNo)
        .should('have.text', `${value}`);
    });
  }

  clickBackBtn() {
    return cy.contains('button', 'Back')
      .should('be.visible')
      .click();
  }

  assureTableEmpty() {
    return cy.get('table.table-bordered tbody')
      .should('exist')
      .find('tr')
      .should('have.length', 0);
  }
}
