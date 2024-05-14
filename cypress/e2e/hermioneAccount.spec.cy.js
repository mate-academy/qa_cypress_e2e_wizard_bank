/// <reference types='cypress' />
import { nameObjectConsts } from '../support/constants.js';
const {
  bntCustomerLogin, user, bntLogin, placeAccNumber, accountNumber,
  selectAccNumber, placeBalanse, balance, placeCurrency, currency, depositSum,
  messageSuccessDepo, withdrawlSum, messageSuccessWithdr, transactionTime,
  debit, credit
} = nameObjectConsts;

const balanseAfterDepo = balance + depositSum;
const balanseAfterWithd = balanseAfterDepo - withdrawlSum;

describe('Bank app', () => {
  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains(bntCustomerLogin).click();
    cy.get('#userSelect').select(user);
    cy.contains(bntLogin).click();

    cy.numberBalanseCurrency(placeAccNumber).should('contain', accountNumber);
    cy.numberBalanseCurrency(placeBalanse).should('contain', balance);
    cy.numberBalanseCurrency(placeCurrency).should('contain', currency);

    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type(depositSum);
    cy.get('.btn-default').click();

    cy.get('.error').should('contain', messageSuccessDepo);
    cy.numberBalanseCurrency(placeBalanse).should('contain', balanseAfterDepo);

    cy.get('[ng-click="withdrawl()"]').click();
    cy.get('[placeholder="amount"]').click();
    cy.get('[ng-click="withdrawl()"]').click();
    cy.get('[placeholder="amount"]').type(withdrawlSum);
    cy.get('.btn-default').click();

    cy.get('.error').should('contain', messageSuccessWithdr);
    cy.numberBalanseCurrency(placeBalanse).should('contain', balanseAfterWithd);

    cy.get('[ng-click="transactions()"]').click();
    cy.reload();
    cy.get('[ng-click="transactions()"]').click();
    cy.get('#start').type(transactionTime);

    cy.get('tr').eq(-1).should('contain', withdrawlSum);
    cy.get('tr').eq(-1).should('contain', debit);
    cy.get('tr').eq(-2).should('contain', depositSum);
    cy.get('tr').eq(-2).should('contain', credit);

    cy.get('[ng-click="back()"]').click();

    cy.get('#accountSelect').select(selectAccNumber);
    cy.get('[ng-click="transactions()"]').click();
    cy.get('#anchor0').should('not.exist');

    cy.get('[ng-show="logout"]').click();
    cy.get('#userSelect').should('exist');
  });
});
