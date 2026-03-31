/// <reference types='cypress' />
import { faker } from '@faker-js/faker';

describe('Bank app', () => {
  const depositAmount = faker.number.int({ min: 100, max: 1000 });
  const withdrawAmount = faker.number.int({ min: 10, max: 90 });
  const expectedBalance = depositAmount - withdrawAmount;
  const userName = 'Hermione Granger';
  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.login(userName);

    cy.get('strong.ng-binding').eq(0).should('have.text', '1001');
    cy.get('strong.ng-binding').eq(1).should('have.text', 'Dollar');
    cy.get('input[placeholder="amount"]').type(depositAmount);
    cy.get('form button[type="submit"]').click();
    cy.get('.error')
      .should('be.visible').and('have.text', 'Deposit Successful');
    cy.get('strong.ng-binding')
      .eq(1).should('have.text', depositAmount.toString());
    cy.get('[ng-click="withdrawl()"]').click();
    cy.get('input[placeholder="amount"]').type(withdrawAmount);
    cy.get('form button[type="submit"]').click();
    cy.get('.error')
      .should('be.visible').and('have.text', 'Transaction successful');
    cy.get('strong.ng-binding')
      .eq(1).should('have.text', expectedBalance.toString());
    cy.get('[ng-click="transactions()"]').click();
    cy.get('#anchor0')
      .should('contain', depositAmount).and('contain', 'Credit');
    cy.get('#anchor1')
      .should('contain', withdrawAmount).and('contain', 'Debit');
    cy.get('[ng-click="back()"]').click();
    cy.get('#accountSelect').select('1002');
    cy.get('[ng-click="transactions()"]').click();
    cy.get('table tbody tr').should('not.exist');
    cy.get('[ng-click="back()"]').click();
    cy.get('.logout').click();
    cy.get('#userSelect').should('be.visible');
  });
});
