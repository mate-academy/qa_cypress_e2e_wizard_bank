/// <reference types='cypress' />

import { generateDateRange } from '../support/generate';

describe('Bank app', () => {
  before(() => {
    cy.visit('/');
  });

  const username = 'Hermoine Granger';
  const depositePlus = Math.floor(Math.random() * 5000) + 1;
  const defaultBalance = 5096;
  const depositeMin = Math.floor(Math.random() * defaultBalance) + 1;
  const date = generateDateRange();
  const defaultCurency = 'Dollar';
  let balance = defaultBalance;

  const depositeMessage = 'Deposit Successful';
  const withdrawlMessage = 'Transaction successful';

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('Customer Login').click();
    cy.get('#userSelect').select(username);
    cy.get('[type="submit"]').click();
    cy.get('.ng-scope')
      .should('contain', username);
    cy.get('[ng-hide="noAccount"]')
      .should('contain', '1001');
    cy.get('[ng-hide="noAccount"]')
      .should('contain', defaultBalance);
    cy.get('[ng-hide="noAccount"]')
      .should('contain', defaultCurency);
    cy.get('[ng-class="btnClass2"]').click();
    cy.get('[ng-model="amount"]').type(depositePlus);
    balance += depositePlus;
    cy.get('[type="submit"]').click();
    cy.get('[ng-show="message"]')
      .should('contain', depositeMessage);
    cy.get('[ng-hide="noAccount"]')
      .should('contain', balance);
    cy.reload();
    cy.get('[ng-class="btnClass3"]').click();
    cy.get('[ng-model="amount"]').type(depositeMin);
    balance -= depositeMin;
    cy.get('[type="submit"]').click();
    cy.get('[ng-show="message"]')
      .should('contain', withdrawlMessage);
    cy.get('[ng-hide="noAccount"]')
      .should('contain', defaultBalance);
    cy.reload();
    cy.get('[ng-class="btnClass1"]').click();
    cy.get('#start').type(date[0]);
    cy.get('.ng-binding')
      .should('contain', depositeMin);
    cy.get('.ng-binding')
      .should('contain', depositePlus);
    cy.get('[ng-click="back()"]').click();
    cy.get('#accountSelect').select('1002');
    cy.get('[ng-class="btnClass1"]').click();
    cy.get('.ng-scope')
      .should('not.contain', 'Credit' && 'Debit');
    cy.get('[class="btn logout"]')
      .click();
    cy.get('[class="form-group"]')
      .should('contain', 'Your Name :');
  });
});
