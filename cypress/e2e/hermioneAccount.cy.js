/// <reference types='cypress' />

import { faker } from '@faker-js/faker';

describe('Bank app', () => {
  const depositAmount = faker.number.int({ min: 500, max: 10000 });
  const withdrawAmount = faker.number.int({ min: 50, max: 500 });
  const depositAmountStr = depositAmount.toString();
  const withdrawAmountStr = withdrawAmount.toString();
  const user = 'Hermoine Granger';
  const accountNumber = '1001';
  const secondAccountNumber = '1002';
  const balance = 5096;
  const currency = 'Dollar';
  const now = new Date();
  const pad = (num) => num.toString().padStart(2, '0');
  const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}T00:00:00`;

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('[name="userSelect"]').select(user);
    cy.contains('.btn', 'Login').click();

    cy.contains('[ng-hide="noAccount"]', 'Account Number :')
      .contains('strong', accountNumber)
      .should('be.visible');

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balance)
      .should('be.visible');

    cy.contains('[ng-hide="noAccount"]', 'Currency')
      .contains('strong', currency)
      .should('be.visible');

    cy.get('[ng-class="btnClass2"]').click();
    cy.contains('[type="submit"]', 'Deposit').should('be.visible');
    cy.get('[placeholder="amount"]').type(depositAmountStr);
    cy.get('[type="submit"]').click();

    cy.contains('[ng-show="message"]', 'Deposit Successful').should(
      'be.visible'
    );

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balance + depositAmount)
      .should('be.visible');

    cy.get('[ng-class="btnClass3"]').click();
    cy.contains('[type="submit"]', 'Withdraw').should('be.visible');
    cy.get('[placeholder="amount"]').type(withdrawAmountStr);
    cy.get('[type="submit"]').click();

    cy.contains('[ng-show="message"]', 'Transaction successful').should(
      'be.visible'
    );

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balance + depositAmount - withdrawAmount)
      .should('be.visible');

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);

    cy.get('[ng-class="btnClass1"]').click();

    cy.get('input[ng-model="startDate"]').clear();
    cy.get('input[ng-model="startDate"]').type(todayStr);
    cy.get('input[ng-model="startDate"]').blur();

    cy.get('table').should('be.visible');

    cy.get('table tr').should('contain', depositAmountStr);
    cy.get('table tr').should('contain', withdrawAmountStr);

    cy.contains('.btn', 'Back').click();

    cy.get('select[ng-hide="noAccount"]').select(secondAccountNumber);

    cy.get('[ng-class="btnClass1"]').click();

    cy.get('table tr').should('not.contain', depositAmountStr);
    cy.get('table tr').should('not.contain', withdrawAmountStr);

    cy.get('[ng-show="logout"]').click();

    cy.url().should(
      'eq',
      'https://www.globalsqa.com/angularJs-protractor/BankingProject/#/customer'
    );
  });
});
