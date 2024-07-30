/// <reference types='cypress' />

import { faker } from '@faker-js/faker';

describe('Bank app', () => {
  const depositAmount = faker.number.int({ min: 500, max: 1000 });
  const withdrawAmount = faker.number.int({ min: 50, max: 500 });
  const balance = 5096;
  const user = 'Hermoine Granger';
  const accountNumber = '1001';
  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.get('[ng-click="customer()"]').click();
    cy.get('[name="userSelect"]').select(user);
    cy.get('[type="submit"]').click();

    cy.contains('[ng-hide="noAccount"]', "Account Number")
      .contains("strong", accountNumber)
      .should("be.visible");
    cy.contains('[ng-hide="noAccount"]', "Balance")
      .contains("strong", balance)
      .should("be.visible");
    cy.contains(".ng-binding", "Dollar").should("be.visible");

    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type(depositAmount);
    cy.contains('[type="submit"]', "Deposit").click();

    cy.get('[ng-show="message"]').should("contain", "Deposit Successful");
    cy.contains('[ng-hide="noAccount"]', balance + depositAmount)
      .contains("strong", balance + depositAmount)
      .should("be.visible");

    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', "Withdraw").should("be.visible");
    cy.get('[placeholder="amount"]').type(withdrawAmount);
    cy.contains('[type="submit"]', "Withdraw").click();

    cy.get('[ng-show="message"]').should("contain", "Transaction successful");
    cy.contains(
      '[ng-hide="noAccount"]',
      balance + depositAmount - withdrawAmount).should("be.visible");

    cy.wait(1000);
    cy.get('[ng-class="btnClass1"]').click();
    cy.contains('[class="ng-binding"]', depositAmount).should("exist");
    cy.contains('[class="ng-binding"]', withdrawAmount).should("exist");
    cy.get('[ng-click="back()"]').click();

    cy.get('[id="accountSelect"]').select('1002');
    cy.wait(1000);
    cy.get('[ng-class="btnClass1"]').click();
    cy.contains('[class="ng-binding"]', depositAmount).should("not.exist");
    cy.contains('[class="ng-binding"]', withdrawAmount).should("not.exist");
    cy.get('[ng-show="logout"]').click();

    cy.url(
      "https://www.globalsqa.com/angularJs-protractor/BankingProject/#/customer"
    ).should('exist');
  });
});
