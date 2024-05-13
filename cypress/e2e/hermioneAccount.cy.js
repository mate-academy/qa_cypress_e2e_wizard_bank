/// <reference types='cypress' />

import { Hermoine } from '../support/randomUser.js';
const users = Hermoine();

describe('Bank app', () => {
  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.get('.borderM > :nth-child(1) > .btn').click();
    cy.get('[name="userSelect"]').select(users.user);
    cy.get('form.ng-valid > .btn').click();
    cy.get('#accountSelect').select(users.accountNumber);
    cy.get('.borderM > :nth-child(3) > :nth-child(2)')
      .should('exist').should('contain', users.Startbalance);
    cy.get('.borderM > :nth-child(3) > :nth-child(3)')
      .should('exist').should('contain.text', users.currency);

    cy.get('[ng-class="btnClass2"]').click();
    cy.get('.form-control').type(users.depositAmount);
    cy.get('[type="submit"]').click();
    cy.get('.error').should('exist')
      .should('contain.text', 'Deposit Successful');
    cy.get('.borderM > :nth-child(3) > :nth-child(2)')
      .should('contain', users.bal);

    cy.get('[ng-class="btnClass3"]').click();
    cy.get('[placeholder="amount')
      .type(users.withdrawAmount);
    cy.get('[placeholder="amount')
      .type(users.withdrawAmount);
    cy.get('[type="submit"]').should('exist').click();
    cy.get('.error')
      .should('contain.text', 'Transaction successful');
    cy.get('.borderM > :nth-child(3) > :nth-child(2)')
      .should('contain', users.balance);

    cy.wait(3000);
    cy.get('[ng-class="btnClass1"]').click();
    cy.get('.fixedTopBox > [style="float:left"]').click(); // i used [Back] button , because test failed without it 
    cy.get('[ng-class="btnClass1"]').click(); 
    cy.get('.ng-binding').should('contain', users.depositAmount);
    cy.get('#anchor0 > :nth-child(3)').should('contain.text', 'Credit');
    cy.get('.ng-binding').should('contain', users.withdrawAmount);
    cy.get('#anchor1 > :nth-child(3)').should('exist').should('contain.text', 'Debit');
    cy.get('.fixedTopBox > [style="float:left"]').click();

    cy.get('#accountSelect').select('1002');
    cy.get('[ng-class="btnClass1"]').click();
    cy.get('td.ng-binding').should('not.exist');

    cy.get('.logout').click();
    cy.get('#userSelect').should('contain.text', '---Your Name---');
  });
}); // if tests failes run again