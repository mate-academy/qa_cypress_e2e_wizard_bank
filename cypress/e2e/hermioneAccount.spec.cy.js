/// <reference types='cypress' />

import { faker } from '@faker-js/faker';

describe('Bank app', () => {
  const user = 'Hermoine Granger';
  const accountNumber = '1001';
  const depositAmount = `${faker.number.int({ min: 500, max: 1000 })}`;
  const withdrawAmount = `${faker.number.int({ min: 50, max: 500 })}`;
  let initialBalance;

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.login(user);

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', '5096')
      .invoke('text')
      .then((text) => {
        initialBalance = +text.trim();

        cy.contains('[ng-hide="noAccount"]', 'Account Number')
          .contains('strong', accountNumber)
          .should('be.visible');

        cy.contains('[ng-hide="noAccount"]', 'Balance')
          .contains('strong', initialBalance)
          .should('be.visible');

        cy.contains('.ng-binding', 'Dollar')
          .should('be.visible');

        cy.get('[ng-click="deposit()"]').click();
        cy.get('[placeholder="amount"]').type(depositAmount);
        cy.contains('[type="submit"]', 'Deposit').click();

        cy.get('[ng-show="message"]')
          .should('contain', 'Deposit Successful');

        const totalBalance = initialBalance + Number(depositAmount);

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
          .contains('strong', totalBalance - withdrawAmount)
          .should('be.visible');

        cy.get('[ng-class="btnClass1"]').click();

        cy.get('table.table.table-bordered.table-striped tr')
          .should('have.length.greaterThan', 1)
          .then(($rows) => {
            cy.get('table.table.table-bordered.table-striped')
              .find('tr')
              .eq($rows.length - 1)
              .should('contain', 'Debit')
              .should('contain', withdrawAmount);
            cy.get('table.table.table-bordered.table-striped')
              .find('tr')
              .eq($rows.length - 2)
              .should('contain', 'Credit').should('contain', depositAmount);
          });

        cy.get('.fixedTopBox > [style="float:left"]').click();

        cy.get('#accountSelect').select('1002');
        cy.get('[ng-class="btnClass1"]').click();
        cy.get('table tbody tr').should('have.length', 0);
        cy.get('.fixedTopBox > [style="float:left"]').click();
        cy.get('.logout').click();
        cy.get('[name="userSelect"]').should('be.visible');
      });
  });
});
