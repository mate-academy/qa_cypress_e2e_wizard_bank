// cypress/support/commands.js

Cypress.Commands.add('loginAsHermione', () => {
  // Kliknięcie przycisku Customer Login z asercją widoczności
  cy.contains('Customer Login').should('be.visible').click();

  // Wybór użytkownika Hermione Granger z asercją widoczności
  cy.get('#userSelect').should('be.visible')
    .select('Hermione Granger');
  cy.get('#userSelect').should('contain', 'Hermione Granger');

  // Kliknięcie Login z asercją widoczności
  cy.contains('.btn', 'Login').should('be.visible').click();
});
