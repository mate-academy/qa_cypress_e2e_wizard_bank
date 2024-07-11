/// <reference types='cypress' />

import { faker } from "@faker-js/faker";

describe("Bank app", () => {
  const depositAmount = faker.number.int({ min: 501, max: 1000 });
  const withdrawAmount = faker.number.int({ min: 1, max: 500 });
  const user = "Hermoine Granger";
  const firstAccount = ["1001", 5096, "Dollar"];
  const secondAccount = ["1002", 0, "Pound"];

  before(() => {
    cy.visit("/");
  });

  it("should provide the ability to work with Hermione's bank account", () => {
    cy.contains(".btn", "Customer Login").click();
    cy.get("#userSelect").select(user);
    cy.contains(".btn", "Login").click();

    cy.contains('[ng-hide="noAccount"]', "Account Number")
      .contains("strong", firstAccount[0])
      .should("be.visible");
    cy.contains('[ng-hide="noAccount"]', "Balance")
      .contains("strong", firstAccount[1])
      .should("be.visible");
    cy.contains(".ng-binding", firstAccount[2]).should("be.visible");

    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type(depositAmount);
    cy.contains('[type="submit"]', "Deposit").click();

    cy.get('[ng-show="message"]').should("contain", "Deposit Successful");
    cy.contains('[ng-hide="noAccount"]', "Balance")
      .contains("strong", firstAccount[1] + depositAmount)
      .should("be.visible");

    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', "Withdraw").should("be.visible");
    cy.get('[placeholder="amount"]').type(withdrawAmount);
    cy.contains('[type="submit"]', "Withdraw").click();

    cy.get('[ng-show="message"]').should("contain", "Transaction successful");
    cy.contains('[ng-hide="noAccount"]', "Balance")
      .contains("strong", firstAccount[1] + depositAmount - withdrawAmount)
      .should("be.visible");

    cy.wait(2000);

    cy.get('[ng-click="transactions()"]').click();

    cy.get("table")
      .should("contain", depositAmount)
      .and("contain", withdrawAmount);

    cy.get('[ng-click="back()"]').click();

    cy.get("#accountSelect").select(secondAccount[0]);

    cy.contains('[ng-hide="noAccount"]', "Account Number")
      .contains("strong", secondAccount[0])
      .should("be.visible");
    cy.contains('[ng-hide="noAccount"]', "Balance")
      .contains("strong", secondAccount[1])
      .should("be.visible");
    cy.contains(".ng-binding", secondAccount[2]).should("be.visible");

    cy.get('[ng-click="transactions()"]').click();

    cy.get("tbody").contains("<tr>").should("not.exist");

    cy.get('[ng-click="byebye()"]').click();

    cy.get("#userSelect").should("be.visible");
  });
});
