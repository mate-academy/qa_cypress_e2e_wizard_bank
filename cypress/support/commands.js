
/// <reference types="cypress" />

Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
  originalFn(url);
});
Cypress.Commands.add('assertPageUrl', (url) => {
  // cy.hash().should("eq", "#" + url);
  cy.url().should('eq', Cypress.config().baseUrl + url);
});
