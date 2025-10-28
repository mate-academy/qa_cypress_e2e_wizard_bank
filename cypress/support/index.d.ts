/// <reference types='cypress' />

type ButtonName =
  'deposit'
  | 'withdrawl'
  | 'back'
  | 'transactions'
  | 'customer'
  | 'login'
  | 'byebye';

declare namespace Cypress {
  interface Chainable<Subject> {
    loginUser(userName: string): Chainable<void>;
    logoutUser(): Chainable<void>;
    assertAccountProperty(property: string, value: string): Chainable<void>;
    clickButton(buttonName: ButtonName);
    makeDeposit(amount: number): Chainable<void>;
    makeWithdrawal(amount: number): Chainable<void>;
    assertSuccessMessage(message: string): Chainable<void>;
    assertTransactionDetails(
      rowNumber: number,
      amount: number,
      transactionType: 'Debit' | 'Credit',
    ): Chainable<void>
  }
}
