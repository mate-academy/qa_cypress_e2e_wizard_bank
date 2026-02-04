import { faker } from '@faker-js/faker';
import { formatDate } from '../support/formatDate';
/// <reference types='cypress' />

describe('Bank app', () => {
  const user = 'Hermoine Granger';
  const accountNumber = '1001';
  const depositAmount = `${faker.number.int({ min: 500, max: 1000 })}`;
  const withdrawAmount = `${faker.number.int({ min: 50, max: 500 })}`;
  const startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('[name="userSelect"]').select(user);
    cy.contains('.btn', 'Login').click();

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', accountNumber)
      .should('be.visible');

    cy.contains('.ng-binding', 'Dollar').should('be.visible');

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .find(':nth-child(2)')
      .invoke('text')
      .should('not.be.empty').then((text) => {
        let balance = text;

        cy.get('[ng-click="deposit()"]').click();
        cy.get('[placeholder="amount"]').type(depositAmount);
        cy.contains('[type="submit"]', 'Deposit').click();

        cy.get('[ng-show="message"]')
          .should('contain', 'Deposit Successful');

        balance = `${parseInt(depositAmount) + parseInt(balance)}`;

        cy.contains('[ng-hide="noAccount"]', 'Balance')
          .contains('strong', balance)
          .should('be.visible');

        cy.get('[ng-click="withdrawl()"]').click();
        cy.contains('[type="submit"]', 'Withdraw')
          .should('be.visible');

        cy.get('[placeholder="amount"]').type(withdrawAmount);
        cy.contains('[type="submit"]', 'Withdraw').click();

        cy.get('[ng-show="message"]')
          .should('contain', 'Transaction successful');

        balance = `${parseInt(balance) - parseInt(withdrawAmount)}`;

        cy.contains('[ng-hide="noAccount"]', 'Balance')
          .contains('strong', balance)
          .should('be.visible');

        cy.get('[ng-click="transactions()"]').click();
        cy.get('#start').clear();
        cy.get('#start').type(formatDate(startDate));

        cy.get('tbody tr').should('exist');

        const operationsTitle = ['Credit', 'Debit'];

        [depositAmount, withdrawAmount].forEach((el, i) => {
          cy.contains(`#anchor${i} td:nth-child(2)`, el)
            .parent('tr')
            .find('td').eq(2)
            .should('contain.text', operationsTitle[i]);
        });

        cy.get('.fixedTopBox > [style="float:left"]').click();

        cy.get('#accountSelect').select((Number(accountNumber) + 1).toString());

        cy.get('[ng-click="transactions()"]').click();
        cy.get('tbody tr').should('not.exist');

        cy.get('.logout').click();
        cy.contains('label', 'Your Name :');
      });
  });
});
