// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('saveBalanceAccount', (amount) => {
  cy.get('.borderM > :nth-child(3) > :nth-child(2)')
    .invoke('text') // 2. Pobierz cały tekst z tego elementu
    .then((text) => {
      // 3. Użyj JavaScript do wyodrębnienia samej kwoty
      const balanceText = text.replace('Balance: ', '').trim(); // Usuń "Balance: " i białe znaki
      amount = balanceText;
      cy.log(amount);
      cy.log(balanceText);
    });
});
