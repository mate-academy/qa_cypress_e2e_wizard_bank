import { faker } from '@faker-js/faker';
/// <reference types='cypress' />

describe('Bank app', () => {
  const depositAmount = `${faker.number.int({ min: 500, max: 1000 })}`;
  const withdrawAmount = `${faker.number.int({ min: 50, max: 500 })}`;
  const balance = depositAmount - withdrawAmount + 5096;
  const user = 'Hermoine Granger';
  const firstAccountNumber = '1001';
  const secondAccountNumber = '1002';
  const currentBalance = '5096';
  const totalBalance = (+depositAmount) + (+currentBalance);

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('[name="userSelect"]').select(user);
    cy.contains('.btn', 'Login').click();

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', firstAccountNumber)
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', currentBalance)
      .should('be.visible');
    cy.contains('.ng-binding', 'Dollar')
      .should('be.visible');

    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type(depositAmount);
    cy.contains('[type="submit"]', 'Deposit').click();

    cy.get('[ng-show="message"]')
      .should('contain', 'Deposit Successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', totalBalance)
      .should('be.visible');

    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw')
      .should('be.visible');
    cy.get('[placeholder="amount"]').type(withdrawAmount);
    cy.contains('[type="submit"]', 'Withdraw').click();

    cy.get('[ng-show="message"]')
      .should('contain', 'Transaction successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balance)
      .should('be.visible');

    cy.get('#accountSelect').select(secondAccountNumber);

    cy.get('[ng-class="btnClass1"]').click();

    cy.get('div[style="height:300px;"] ' +
    '.table.table-bordered.table-striped tbody')
      .should('exist')
      .and('not.have.descendants', 'tr');

    cy.get('.logout').click();
    cy.get('label').should('contain.text', 'Your Name');
  });
});
