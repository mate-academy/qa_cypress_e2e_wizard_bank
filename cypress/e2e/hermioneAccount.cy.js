/// <reference types='cypress' />

import { User } from '../support/randomuser.js';
const users = User();

describe('Bank app', () => {
  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.get('.borderM > :nth-child(1) > .btn').should('exist').click();
    cy.get('[name="userSelect"]').should('exist').select(users.user);
    cy.get('form.ng-valid > .btn').should('exist').click();
    cy.get('#accountSelect').should('exist').select(users.accountNumber);
    cy.get('.borderM > :nth-child(3) > :nth-child(2)')
      .should('exist').should('contain', users.Startbalance);
    cy.get('.borderM > :nth-child(3) > :nth-child(3)')
      .should('exist').should('contain.text', users.currency);

    cy.get('[ng-class="btnClass2"]').should('exist').click();
    cy.get('.form-control').should('exist').type(users.depositAmount);
    cy.get('[type="submit"]').should('exist').click();
    cy.get('.error').should('exist')
      .should('contain.text', 'Deposit Successful');
    cy.get('.borderM > :nth-child(3) > :nth-child(2)')
      .should('contain', users.bal);

    cy.get('[ng-class="btnClass3"]').should('exist').click();
    cy.get('[placeholder="amount').should('exist')
      .type(users.withdrawAmount);
    cy.get('[placeholder="amount').should('exist')
      .type(users.withdrawAmount);
    cy.get('[type="submit"]').should('exist').click();
    cy.get('.error').should('exist')
      .should('contain.text', 'Transaction successful');
    cy.get('.borderM > :nth-child(3) > :nth-child(2)')
      .should('contain', users.balance);

    cy.get('[ng-class="btnClass1"]').should('exist').click();
    cy.get('.fixedTopBox > [style="float:left"]')
      .should('exist').click();
    cy.get('[ng-class="btnClass1"]').should('exist').click();
    cy.get('.ng-binding').should('exist')
      .should('contain', users.depositAmount);
    cy.get('#anchor0 > :nth-child(3)').should('exist')
      .should('contain.text', 'Credit');
    cy.get('.ng-binding').should('exist')
      .should('contain', users.withdrawAmount);
    cy.get('#anchor1 > :nth-child(3)').should('exist')
      .should('contain.text', 'Debit');
    cy.get('.fixedTopBox > [style="float:left"]')
      .should('exist').click();

    cy.get('#accountSelect').should('exist').select('1002');
    cy.get('[ng-class="btnClass1"]').should('exist').click();
    cy.get('td.ng-binding').should('not.exist');

    cy.get('.logout').should('exist').click();
    cy.get('#userSelect').should('contain.text', '---Your Name---');
  });
});
