/// <reference types='cypress' />

Cypress.Commands.add('checkAccountInfo', (name, value) => {
  cy.contains('[ng-hide="noAccount"]', name)
    .contains('strong', value)
    .should('be.visible');
});

Cypress.Commands.add('clickButton', (name) => {
  cy.contains('.btn', name).should('be.visible').click();
});

Cypress.Commands.add('pressSubmitButton', () => {
  cy.get('button[type=submit]').click();
});
Cypress.Commands.add('findSubmitButton', (name) => {
  cy.contains('button[type="submit"]', name).should('be.visible');
});

Cypress.Commands.add('selectDropdownValue', (selector, value) => {
  cy.get(selector).select(value);
});

Cypress.Commands.add('typeInput', (type, value) => {
  cy.get(`input[type=${type}]`).type(value);
});

Cypress.Commands.add('verifyMessage', (name) => {
  cy.get('[ng-show="message"]').should('contain', name);
});

Cypress.Commands.add('assertURLContains', (name) => {
  cy.url().should('include', name);
});
