/// <reference types='cypress' />
import { faker } from '@faker-js/faker';

describe('Bank app', () => {
  beforeEach(() => {
    cy.visit('');
  });

  const userHermiona = 'Hermoine Granger';
  const accounNumber = 1001;
  const currency = 'Dollar';
  const amountPlaceholder = 'amount';
  const depositAmount = `${faker.number.int({ min: 1648, max: 2023 })}`;
  const buttonDeposit = 'Deposit';
  const depositMessage = 'Deposit Successful';
  const buttonWithdrawl = 'Withdrawl';
  const withdrawlAmount = `${faker.number.int({ min: 1648, max: depositAmount })}`;
  const withdrawlMassage = 'Transaction successful';
  const buttonTransactions = 'Transactions';
  const changeAccountNumber = 1003;

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.get('.btn.btn-primary.btn-lg').should('be.visible');
    cy.contains('.btn.btn-primary.btn-lg', 'Customer Login').click();

    cy.get('#userSelect').select(userHermiona);
    cy.get('button[type="submit"]').click();

    cy.contains('#accountSelect', accounNumber).should('be.visible');

    cy.get('.center').should('contain.text', 'Account Numb');
    cy.contains('.ng-binding', accounNumber).should('be.visible');

    cy.get('.center').should('contain.text', 'Balance :');
    cy.get('.center').should('contain.text', 'Currency');
    cy.contains('.ng-binding', currency).should('be.visible');

    cy.contains('.btn.btn-lg.tab', buttonTransactions)
      .should('be.visible')
      .click();
    cy.contains('.btn', 'Reset').click();
    cy.contains('.btn', 'Back').click();

    // eslint-disable-next-line max-len
    cy.get('.center .ng-binding').eq(1).invoke('text').then((initialBalance) => {
      cy.contains('.btn.btn-lg.tab', buttonDeposit)
        .should('be.visible')
        .click();
      cy.findByPlaceholder(amountPlaceholder).type(depositAmount);
      cy.get('button[type="submit"]').click();
      cy.contains('.error', depositMessage).should('be.visible');

      // eslint-disable-next-line max-len
      cy.get('.center .ng-binding').eq(1).invoke('text').should((newBalance) => {
        expect(newBalance).not.to.eq(initialBalance);
      });
    });

    cy.contains('.btn.btn-lg.tab', buttonTransactions)
      .should('be.visible')
      .click();
    cy.contains('.btn', 'Back').click();

    // eslint-disable-next-line max-len
    cy.get('.center .ng-binding').eq(1).invoke('text').then((initialBalance) => {
      cy.contains('.btn.btn-lg.tab', buttonWithdrawl)
        .should('be.visible')
        .click();
      cy.findByPlaceholder(amountPlaceholder).type(withdrawlAmount);
      cy.get('button[type="submit"]').click();

      cy.contains('.error', withdrawlMassage).should('be.visible');

      cy.get('.center .ng-binding').eq(1).invoke('text')
        .should((newBalance) => {
          expect(newBalance).not.to.eq(initialBalance);
        });
    });

    cy.reload();

    cy.contains('.btn.btn-lg.tab', buttonTransactions)
      .should('be.visible')
      .click();
    cy.contains('tr', 'Credit').should('be.visible');
    cy.contains('tr', 'Debit').should('be.visible');
    cy.get('#anchor0 .ng-binding').should('contain', depositAmount);
    cy.get('#anchor1 .ng-binding').should('contain', withdrawlAmount);
    cy.contains('.btn', 'Back').click();

    cy.get('#accountSelect').select(`number:${changeAccountNumber}`);
    cy.contains('#accountSelect', changeAccountNumber).should('be.visible');

    cy.contains('.btn.btn-lg.tab', buttonTransactions).click();
    cy.contains('.btn', 'Back').click();
    cy.contains('.btn', 'Logout').click();
  });
});
