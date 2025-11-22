
class BankUserObject {
  get balanceSelector() {
    return cy.get('.borderM > :nth-child(3) > :nth-child(2)');
  }

  clickCustomerLogin() {
    cy.contains('.btn', 'Customer Login').click();
  }

  selectUser(user) {
    cy.get('[name="userSelect"]').select(user);
  }

  selectAccount(account) {
    cy.get('[ng-change="selectAcct()"]')
      .select(account);
  }

  clickLoginBtn() {
    cy.contains('.btn', 'Login').click();
  }

  assertAccountNumber(accountNumber) {
    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', accountNumber)
      .should('be.visible');
  }

  assertCurrency(currency) {
    cy.contains('.ng-binding', currency)
      .should('be.visible');
  }

  clickDepositBtn() {
    cy.get('[ng-click="deposit()"]').click();
  }

  typeAmount(amount) {
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('[placeholder="amount"]')
      .type(amount);
  }

  submitTransaction() {
    cy.contains('[type="submit"]', 'Deposit').click();
  }

  assertTransaction() {
    cy.get('[ng-show="message"]')
      .should('contain', 'Transaction successful');
  }

  assertDepositInTransactions(transactions, deposit) {
    cy.get(`#anchor${transactions - 1} > :nth-child(2)`)
      .should('contain', deposit);
    cy.get(`#anchor${transactions - 1} > :nth-child(3)`)
      .should('contain', 'Credit');
  }

  assertWithdrawalsInTransactions(transactions, withdrawal) {
    cy.get(`#anchor${transactions - 1} > :nth-child(2)`)
      .should('contain', withdrawal);
    cy.get(`#anchor${transactions - 1} > :nth-child(3)`)
      .should('contain', 'Debit');
  }

  assertDeposit() {
    cy.get('[ng-show="message"]')
      .should('contain', 'Deposit Successful');
  }

  assertTransactionPage(amount) {
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', amount)
      .should('be.visible');
  }

  clickWithdrawalBtn() {
    cy.get('[ng-click="withdrawl()"]').click();
  }

  clickBackBtn() {
    cy.get('[ng-click="back()"]')
      .click();
  }

  clickTransactionsBtn() {
    cy.get('[ng-click="transactions()"]').click();
  }

  assertWithdrawal() {
    cy.contains('[type="submit"]', 'Withdraw')
      .should('be.visible');
  }

  typeAmountOfWithdrawal(amount) {
    cy.get('[placeholder="amount"]').type(amount);
  }

  clickSubmitBtn() {
    cy.contains('[type="submit"]', 'Withdraw').click();
  }

  assertBalance(balance) {
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balance)
      .should('be.visible');
  }

  clickLogoutBtn() {
    cy.get('[ng-click="byebye()"]')
      .click();
  }

  assertLoginUser(name) {
    cy.contains('.fontBig', name)
      .should('exist');
  }

  assertLogoutUser() {
    cy.get('[ng-click="home()"]')
      .should('exist');
    cy.contains('strong', 'XYZ Bank')
      .should('exist');
  }
}

export default BankUserObject;
