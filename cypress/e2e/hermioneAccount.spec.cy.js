import { faker } from '@faker-js/faker';
/// <reference types='cypress' />

describe('Bank app', () => {
  const accountNumber = '1001';
  const balance = '5096';
  const currency = 'Dollar';
  const depositValue = `${faker.number.int({ min: 100, max: 300 })}`;
  const afterDeposit = `${+balance + +depositValue}`;
  const withdrawalValue = `${faker.number.int({ min: 100, max: 300 })}`;
  const afterWithdrawal = `${+afterDeposit - withdrawalValue}`;
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0') + 'T';
  const hour = currentDate.getHours().toString().padStart(2, '0') + ':';
  const minutes = (currentDate.getMinutes() - 1).toString().padStart(2, '0');
  const typeDate = `${year}-${month}-${day}${hour}${minutes}`;

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('#userSelect').select(1);
    cy.contains('[type="submit"]', 'Login').click();
    cy.get('#accountSelect').should('have.value', `number:${accountNumber}`);
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('.ng-binding', balance);
    cy.contains('[ng-hide="noAccount"]', 'Currency')
      .contains('.ng-binding', currency);

    cy.get('[ng-click="deposit()"]').click();
    cy.get('[type="number"]')
      .should('have.attr', 'placeholder', 'amount');
    cy.get('[type="number"]').type(depositValue);
    cy.contains('[type="submit"]', 'Deposit').click();
    cy.contains('[ng-show="message"]', 'Deposit Successful')
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('.ng-binding', afterDeposit);

    cy.contains('[ng-click="withdrawl()"]', 'Withdrawl').click();
    cy.get('[ng-submit="withdrawl()"]').within(() => {
      cy.contains('label', 'Amount to be Withdrawn').should('be.visible');
      cy.get('[type="number"]')
        .should('have.attr', 'placeholder', 'amount');
      cy.get('[type="number"]').type(withdrawalValue);
      cy.contains('[type="submit"]', 'Withdraw').click();
    });
    cy.contains('[ng-show="message"]', 'Transaction successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('.ng-binding', afterWithdrawal);
    cy.contains('[ng-click="transactions()"]', 'Transactions').click();
    cy.get('#start').type(typeDate);
    cy.get('#anchor0').within(() => {
      cy.contains('.ng-binding', depositValue);
      cy.contains('.ng-binding', 'Credit');
    });

    cy.get('#anchor1').within(() => {
      cy.contains('.ng-binding', withdrawalValue);
      cy.contains('.ng-binding', 'Debit');
    });

    cy.contains('[ng-click="back()"]', 'Back').click();
    cy.get('#accountSelect').select('number:1003');
    cy.contains('[ng-click="transactions()"]', 'Transactions').click();
    cy.get('#anchor0').should('not.eq');
    cy.contains('[ng-click="byebye()"]', 'Logout').click();
    cy.get('#userSelect').should('contain.text', '---Your Name---');
  });
});
