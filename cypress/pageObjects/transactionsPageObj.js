/// <reference types='cypress' />
export default class TransactionsPageObj {
  clickTableHead(elType, cellName) {
    return cy.contains(elType, cellName)
      .should('be.visible')
      .click();
  }

  assertTableRowData(row, columnNo, value) {
    return cy.get(row).within(() => {
      cy.get('td').eq(columnNo)
        .should('have.text', value);
    });
  }

  clickBackBtn() {
    return cy.contains('button', 'Back')
      .click();
  }

  assureTableEmpty() {
    return cy.get('table.table-bordered tbody')
      .should('exist') &&
    cy.get('table.table-bordered tbody tr')
      .should('not.exist');
  }
}
