/// <reference types='cypress' />
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
Cypress.Commands.add('findByNgClick', (ngClick) => {
  cy.get(`[ng-click="${String(ngClick)}()"]`);
});

Cypress.Commands.add('findByNgHide', (ngHide, arg1, arg2) => {
  cy.contains(`[ng-hide="${String(ngHide)}"]`, arg1).contains('strong', arg2);
});

Cypress.Commands.add('findByNgShow', (ngShow) => {
  cy.get(`[ng-show="${String(ngShow)}"]`);
});

Cypress.Commands.add('findByPlaceholder', (placeholder) => {
  cy.get(`[placeholder="${String(placeholder)}"]`);
});
