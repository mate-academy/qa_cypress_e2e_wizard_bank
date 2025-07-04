export default class WithdrawalPageObject {
  enterWithdrawalAmount(amount) {
    return cy.get('input[ng-model="amount"]').type(amount);
  }

  clickWithdrawalButton() {
    return cy.get('button[type="submit"]').contains('Withdraw').click();
  }

  verifyWithdrawalSuccessMessage(message) {
    return cy.get('.error').should('contain', message);
  }

  verifyBalanceAfterWithdrawal(balance) {
    return cy.get('.ng-binding').should('contain', balance);
  }
}
