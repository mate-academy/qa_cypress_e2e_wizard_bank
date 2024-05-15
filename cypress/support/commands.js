
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('findByPlaceholder', (placeholder) => {
  cy.get(`input[placeholder*="${placeholder}"]`);
});

Cypress.Commands.add('numberBalanseCurrency', (number1to3) => {
  cy.get(`.borderM > :nth-child(3) > :nth-child(${number1to3})`);
});
