export default class HomePageObject {
  customerName = 'Hermione Granger';

  verifyCustomerLoginButton() {
    return cy
      .get('button[ng-click="customer()"]')
      .contains('Customer Login')
      .should('be.visible');
  }

  clickCustomerLoginButton() {
    return cy
      .get('button[ng-click="customer()"]')
      .contains('Customer Login')
      .click();
  }

  getBankManagerLoginButton() {
    return cy
      .get('button[ng-click="manager()"]')
      .contains('Bank Manager Login')
      .click();
  }

  selectCustomerName() {
    return cy.get('#userSelect').select(this.customerName);
  }

  clickLoginButton() {
    return cy.get('button[type="submit"]').contains('Login').click();
  }
}
