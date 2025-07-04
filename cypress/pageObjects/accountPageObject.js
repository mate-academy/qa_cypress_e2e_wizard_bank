export default class AccountPageObject {
  clickTransactionsButton() {
    return cy
      .get('button[ng-click="transactions()"]')
      .contains('Transactions')
      .click();
  }

  clickDepositButton() {
    return cy.get('button[ng-click="deposit()"]').contains('Deposit').click();
  }

  clickWithdrawButton() {
    return cy.get('button[ng-class="btnClass3"]').contains('Withdrawl').click();
  }

  verifyAccountNumber(accountNumber) {
    return cy
      .get('div[ng-show="accountNo"]')
      .should('contain', `Account Number : ${accountNumber}`);
  }

  verifyAccountBalance(balance) {
    return cy
      .get('div[ng-show="balance"]')
      .should('contain', `Balance : ${balance}`);
  }

  verifyCurrency(currency) {
    return cy
      .get('div[ng-show="currency"]')
      .should('contain', `Currency : ${currency}`);
  }

  verifyCustomerName(customerName) {
    return cy
      .get('div[ng-show="customerName"]')
      .should('contain', `Customer Name : ${customerName}`);
  }
}
