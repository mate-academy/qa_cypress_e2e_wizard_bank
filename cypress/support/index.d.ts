/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {

    login(accountInfo: Object): Chainable<any>
    assertAccountInfo(accountInfo: Object): Chainable<any>
    transactionOperations(accountInfo: Object): Chainable<any>
    transactionDetails(
      accountInfo: Object,
      depositTime: string,
      withdrawTime: string
    ): Chainable<any>
    noTransactionAccount(
      accountInfo: Object
    ): Chainable<any>
  }
}
