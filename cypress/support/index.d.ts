declare namespace Cypress {
  interface Chainable<Subject> {
    findByPlaceholder(placeholder: string): Chainable<any>
  }
}