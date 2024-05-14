import { faker } from '@faker-js/faker';
/// <reference types='cypress' />

describe('Wizard Bank app', () => {
  const depositAmount = `${faker.number.int({ min: 500, max: 1000 })}`;
  const withdrawAmount = `${faker.number.int({ min: 50, max: 500 })}`;
  const user = 'Hermoine Granger' 
  const accountNumber = '1001';
  const anotherAccountNumber = '1002';
  const accountBalance = '5096';
  let currentBalance = 0;
  const currentDateWithTimeZone = new Date().toISOString();
  const currentDate = currentDateWithTimeZone.slice(0, -5);

  before(() => {
    cy.visit('https://www.globalsqa.com/angularJs-protractor/BankingProject/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('#userSelect').select(user);
    cy.get('[type="submit"]').click();

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', accountNumber)
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', accountBalance)
      .should('be.visible');
    cy.contains('.ng-binding', 'Dollar')
      .should('be.visible');

    cy.get('[ng-class="btnClass2"]').click();
    cy.get('[placeholder="amount"]').type(depositAmount);
    cy.get('.btn.btn-default').click();

    cy.get('.error.ng-binding')
      .should('contain', 'Deposit Successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', currentBalance = (Number(accountBalance) + Number(depositAmount)))
      .should('be.visible');

    cy.get('[ng-class="btnClass3"]').click();
    cy.get('[placeholder="amount"]').type(withdrawAmount);
    /// I duplicate it because it don`t work for first time
    cy.get('[placeholder="amount"]').type(withdrawAmount);
    cy.get('.btn.btn-default').click();

    cy.get('.error.ng-binding')
      .should('contain', 'Transaction successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', currentBalance = currentBalance - Number(withdrawAmount))
      .should('be.visible');

    cy.get('[ng-class="btnClass1"]').click();
    cy.get('#start').click()
      .type(currentDate);
    cy.get('#anchor0').should('contain', Number(depositAmount))
      .and('contain', 'Credit')
    cy.get('#anchor1').should('contain', Number(withdrawAmount))
      .and('contain', 'Debit')

    cy.get('[ng-click="back()"]').click();
    cy.get('#accountSelect').select(anotherAccountNumber);
    cy.get('[ng-class="btnClass1"]').click();
    cy.contains('tbody', 'tr').should('not.exist');

    cy.get('[ng-show="logout"]').click();
    cy.contains('.mainHeading', 'XYZ Bank').should('exist');
  });
});
