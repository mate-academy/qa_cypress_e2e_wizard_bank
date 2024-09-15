import { faker } from "@faker-js/faker";
/// <reference types='cypress' />

describe("Bank app", () => {
  const depositAmount = `${faker.number.int({ min: 50, max: 1000 })}`;
  const withdrawAmount = `${faker.number.int({ min: 10, max: 500 })}`;
  const startBalance = "5096";
  const balanceDeposit = parseInt(startBalance) + parseInt(depositAmount);
  const balanceWithdrawal = parseInt(balanceDeposit) - parseInt(withdrawAmount);

  before(() => {
    cy.visit("/");
  });

  it("Should provide the ability to work with Hermione's bank account", () => {
    cy.contains(".btn", "Customer Login").click();
    cy.get("#userSelect").select("Hermoine Granger");
    cy.contains(".btn", "Login").click();

    cy.get("#accountSelect").select("1001");
    cy.get("strong.ng-binding").contains("5096");
    cy.get("strong.ng-binding").contains("Dollar");

    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type(depositAmount);
    cy.contains('[type="submit"]', "Deposit").click();
    cy.get('[ng-show="message"]').should("contain", "Deposit Successful");
    cy.contains('[ng-hide="noAccount"]', "Balance")
      .contains("strong", balanceDeposit)
      .should("be.visible");

    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', "Withdraw").should("be.visible");
    cy.get('[placeholder="amount"]').type(withdrawAmount);
    cy.contains('[type="submit"]', "Withdraw").click();

    cy.get('[ng-show="message"]').should("contain", "Transaction successful");
    cy.contains('[ng-hide="noAccount"]', "Balance")
      .contains("strong", balanceWithdrawal)
      .should("be.visible");

    cy.get('[ng-click="transactions()"]').click();
    cy.get("tr > :nth-child(1)").should("be.visible");
    cy.get("a[ng-click*=\"sortType = 'date'\"]").click({ force: true });
    cy.get('[ng-click="back()"]').click();
    cy.get("#accountSelect").select("1002");
    cy.get('[ng-click="transactions()"]').click();
    cy.get("td.ng-binding").should("not.exist");
    cy.get('[ng-click="byebye()"]').click();
    cy.get("#userSelect").should("be.visible");
  });
});
