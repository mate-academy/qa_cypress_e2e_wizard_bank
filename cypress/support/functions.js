export function countUsers() {
  cy.get('.table tbody tr')
    .its('length')
    .as('users');
}

export function countTransactions() {
  cy.get('.table tbody tr')
    .its('length')
    .as('transactions');
}
