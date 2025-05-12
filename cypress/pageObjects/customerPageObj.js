/// <reference types='cypress' />

export default class CustomerPageObj {
  selectCustomer(user) {
    return cy.get('#userSelect')
      .select(user);
  }

  clickLoginBtn() {
    return cy.contains('button', 'Login')
      .click();
  }

  get userSelector() {
    return cy.get('#userSelect');
  }
}
