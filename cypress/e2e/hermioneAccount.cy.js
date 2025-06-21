import { faker } from "@faker-js/faker";
/// <reference types='cypress' />

describe("Bank app", () => {
  before(() => {
    cy.visit("/");
  });

  beforeEach(() => {
    cy.contains("button", "Customer Login")
      .should("be.visible")
      .should("not.be.disabled")
      .click();

    cy.get("#userSelect").select("Hermoine Granger");
    cy.get(`button[type="submit"]`)
      .should("be.visible")
      .should("not.be.disabled")
      .click();
    cy.url().should("contain", "/account");
  });

  it("should allow to login", () => {});

  it("should allow to choose account number", () => {
    cy.get("#accountSelect").select("1003");
  });

  it("should allow to deposit", () => {
    const depositAmount = faker.number.int({ min: 10, max: 10000 });

    cy.contains("button", "Deposit")
      .should("be.visible")
      .should("not.be.disabled")
      .click();

    cy.get(`input[placeholder="amount"]`)
      .should("be.visible")
      .type(depositAmount.toString());
    cy.get(`button[type="submit"]`).click();

    cy.get(`span.error.ng-binding`, { timeout: 4000 }).should(
      "contain",
      "Deposit Successful"
    );
  });

  it("should allow to withdraw", () => {
    const amountToWithdraw = faker.number.int({ min: 20, max: 1000 });

    cy.get(`input[placeholder="amount"]`).should("be.visible").click();
    cy.get(`input[placeholder="amount"]`).type(amountToWithdraw.toString());
    cy.get(`button[type="submit"]`)
      .should("be.visible")
      .should("not.be.disabled");

    cy.get(`button[type="submit"]`).click();

    cy.get("span.error.ng-binding", { timeout: 2000 })
      .should("be.visible")
      .should("contain", "Transaction successful");
  });

  it("should allow to watch transactions", () => {
    cy.contains("button", "Transactions")
      .should("be.visible")
      .should("not.be.disabled")
      .click();

    cy.url().should("contain", "/listTx");
  });

  it("should allow to logout", () => {
    cy.get(".btn.logout")
      .should("be.visible")
      .should("not.be.disabled")
      .click();

    cy.get(".btn.logout", { timeout: 3000 }).should("not.exist");
  });
});
