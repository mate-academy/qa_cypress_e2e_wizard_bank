/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    findByNgClick(ngClick: string): Chainable<any>;
    findByNgHide(ngHide: string, arg1: string, arg2: string): Chainable<any>;
    findByNgShow(nhShow: string): Chainable<any>;
    findByPlaceholder(placeholder: string): Chainable<any>;
  }
}
