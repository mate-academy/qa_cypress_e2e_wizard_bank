/* eslint-disable no-unused-vars */
import { faker } from '@faker-js/faker';
/// <reference types='cypress' />

describe('Wizard bank app', () => {
  // const depositAmoun = `${faker.number.int({ min: 500, max: 1000 })}`;
  // const withdrawAmount = `${faker.number.int({ min: 50, max: 500 })}`;
  const user = 'Hermoine Granger';
  const accountNumber = '1001';
  const currency = 'Dollar';
  const depositBtn = 'Deposit';
  const balance = 5096;
  const depositAmount = 100;
  const withdrawAmount = 50;
  const balanceDeposit = +balance + depositAmount;
  // const balance = depositAmoun - withdrawAmount;
  // const sumBalance = 5096 + 100;

  beforeEach(() => {
    cy.visit('/');
  });
  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.url().should('include', 'customer');
    // eslint-disable-next-line no-undef
    cy.get('#userSelect').select(user);
    cy.get('[type="submit"]').click();
    cy.get('.fontBig').should('contain', user);

    // Assert Account Number
    cy.get('.ng-binding')
      .should('contains.text', accountNumber)
      .should('be.visible');
    // Assert Balance
    cy.get('.ng-binding')
      .should('contains.text', balance)
      .should('be.visible');

    cy.get('.ng-binding')
      .should('contains.text', currency)
      .should('be.visible');

    // // 7
    cy.contains('.btn', depositBtn).click();
    cy.get('[placeholder="amount"]').type(depositAmount);
    cy.contains('[type="submit"]', depositBtn).click();
    cy.contains('.error', 'Deposit Successful').should('be.visible');

    // // 11
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balanceDeposit)
      .should('be.visible');

    // 12
    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw').should('be.visible');
    cy.get('[placeholder="amount"]').type(withdrawAmount);
    cy.contains('[type="submit"]', 'Withdraw').click();
    cy.get('[ng-show="message"]').should('contain', 'Transaction successful');

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balanceDeposit - withdrawAmount)
      .should('be.visible');

    cy.get('[ng-click="transactions()"]').click();

    cy.get('[ng-click="back()"]').click();

    cy.get('#accountSelect').select('1002');

    cy.get('[ng-click="transactions()"]').click();
    cy.get('td.ng-binding')
      .should('not.exist')
      .should('not.exist');

    cy.get('[ng-click="byebye()"]').click();
    cy.get('label').should('contain', 'Your Name :');
    cy.url().should('include', 'customer');
  });
});
