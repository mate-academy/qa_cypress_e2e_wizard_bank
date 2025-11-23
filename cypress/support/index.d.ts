type ButtonName =
  | "deposit"
  | "withdrawl"
  | "back"
  | "transactions"
  | "customer"
  | "login"
  | "byebye";

declare namespace Cypress {
  interface Chainable<Subject> {
    clickButton(buttonText: ButtonName);
    login(userName: string): Chainable<void>;
    assertAccountProperty(property: string, value: string): Chainable<void>;
    makeDeposit(amount: number): Chainable<void>;
    assertSuccessMessage(message: string): Chainable<void>;
    makeWithdrawal(amount: number): Chainable<void>;
    assertTransactionDetails(
      rowNumber: number,
      amount: number,
      transactionType: "Debit" | "Credit"
    ): Chainable<void>;
    logout(): Chainable<void>;
  }
}