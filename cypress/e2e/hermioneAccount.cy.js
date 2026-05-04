/// <reference types='cypress' />

describe("Bank app", () => {
  const user = "Hermione Granger";
  const firstAccount = "1001";
  const secondAccount = "1002";
  const depositAccount = 500;
  const withdrawAmount = 200;

  const depositInput =
    'form[ng-submit="deposit()"] input[placeholder="amount"]';
  const depositSumbit = 'form[ng-submit="deposit()"] button[type="submit"]';

  const withdrawInput =
    'form[ng-submit="withdrawl()"] input[placeholder="amount"]';
  const withdrawSubmit = 'form[ng-submit="withdrawl()"] button[type="submit"]';

  before(() => {
    cy.visit("/");
  });

  it("should provide the ability to work with Hermione's bank account", () => {
    cy.contains(".btn", "Customer Login").click();
    cy.get('[name="userSelect"]').should("be.visible").select(user);
    cy.contains(".btn", "Login").click();

    cy.get('[ng-hide="noAccount"] strong')
      .eq(0)
      .should("contain.text", firstAccount);

    cy.get('[ng-hide="noAccount"] strong')
      .eq(2)
      .should("contain.text", "Dollar");

    cy.get('[ng-hide="noAccount"] strong')
      .eq(1)
      .invoke("text")
      .then((balanceText) => {
        const initialBalance = Number(balanceText.trim());
        const expectedAfterDeposit = initialBalance + depositAmount;
        const expectedAfterWithdraw = expectedAfterDeposit - withdrawAmount;

        cy.contains("button", "Deposit").click();

        cy.get(depositInput).should("be.visible");
        cy.get(depositInput).clear();
        cy.get(depositInput).type(String(depositAmount));

        cy.get(depositSubmit).click();

        cy.contains('[ng-show="message"]', "Deposit Successful").should(
          "be.visible",
        );

        cy.get('[ng-hide="noAccount"] strong')
          .eq(1)
          .should("contain.text", String(expectedAfterDeposit));

        cy.contains("button", "Withdrawl").click();

        cy.get(withdrawInput).should("be.visible");
        cy.get(withdrawInput).clear();
        cy.get(withdrawInput).type(String(withdrawAmount));

        cy.get(withdrawSubmit).click();

        cy.contains('[ng-show="message"]', "Transaction successful").should(
          "be.visible",
        );

        cy.get('[ng-hide="noAccount"] strong')
          .eq(1)
          .should("contain.text", String(expectedAfterWithdraw));

        cy.contains("button", "Transactions").click();

        cy.get("table tbody tr").should("have.length.at.least", 2);
        cy.contains("td", "Credit").should("exist");
        cy.contains("td", "Debit").should("exist");

        cy.contains("button", "Back").click();
        cy.contains('[ng-hide="noAccount"]', "Balance").should("be.visible");

        cy.get("#accountSelect").select(secondAccount);

        cy.get('[ng-hide="noAccount"] strong')
          .eq(0)
          .should("contain.text", secondAccount);

        cy.contains("button", "Transactions").click();
        cy.get("table tbody tr").should("have.length", 0);

        cy.contains("button", "Logout").should("be.visible").click();

        cy.url().should("include", "#/customer");
        cy.get('[name="userSelect"]').should("be.visible");
        cy.contains("label", "Your Name").should("be.visible");
        cy.contains("button", "Home").should("be.visible");
        cy.contains("button", "Logout").should("not.be.visible");
      });
  });
});
