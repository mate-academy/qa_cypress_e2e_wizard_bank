export default class DepositPageObject {
  enterDepositAmount(amount) {
    return cy.get('input[ng-model="amount"]').type(amount);
  }

  clickDepositButton() {
    return cy.get('button[type="submit"]').contains('Deposit').click();
  }

  verifyDepositSuccessMessage(message) {
    return cy.get('.error').should('contain', message);
  }

  verifyBalanceAfterDeposit(balance) {
    return cy.get('.ng-binding').should('contain', balance);
  }
}
