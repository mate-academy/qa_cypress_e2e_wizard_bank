/// <reference types='cypress' />

export default class AccountPageObj {
  assertAccountNumber(accountNumber) {
    return cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', accountNumber)
      .should('be.visible');
  }

  assertBalance(balance) {
    return cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balance)
      .should('be.visible');
  }

  assertCurrency(currency) {
    return cy.contains('[ng-hide="noAccount"]', 'Currency')
      .contains('strong', currency)
      .should('be.visible');
  }

  clickOperationType(operation) {
    return cy.contains('button', operation)
      .click();
  }

  insertAmount(amount) {
    return cy.get('[placeholder="amount"]')
      .should('be.enabled')
      .type(amount);
  }

  clickSubmitBtn(btnName) {
    return cy.get('[type="submit"]')
      .contains('button', btnName)
      .click();
  }

  assertMessage(message) {
    return cy.get('[ng-show="message"]')
      .should('have.text', message)
      .and('be.visible');
  }

  assertFieldName(name) {
    return cy.contains('.form-group label', name)
      .should('be.visible');
  }

  changeAccountNoTo(number) {
    return cy.get('#accountSelect').select(number);
  }

  logout() {
    return cy.contains('button', 'Logout').click();
  }
}
