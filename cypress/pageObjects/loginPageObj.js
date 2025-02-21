/// <reference types='cypress' />

export default class LoginPageObj {
  clickCustomerLoginBtn() {
    return cy.contains('button', 'Customer Login').click();
  }
}
