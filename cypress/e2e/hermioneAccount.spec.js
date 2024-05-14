import { faker } from '@faker-js/faker';
import './commands';
/// <reference types='cypress' />

describe('Bank app', () => {
  const user = 'Hermoine Granger';
  const mainAccountNumber = 1001;
  const startBalance = 5103;
  const currentCurrency = 'Dollar';
  const depositAmount = `${faker.number.int({ min: 100, max: 1000 })}`;
  const withdrawAmount = `${faker.number.int({ min: 50, max: 500 })}`;
  const actualBalance =
  startBalance + parseInt(depositAmount) - parseInt(withdrawAmount);
  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('#userSelect').select(user);
    cy.contains('.btn', 'Login').click();

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', mainAccountNumber)
      .should('be.visible');

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', startBalance)
      .should('be.visible');

    cy.contains('[ng-hide="noAccount"]', 'Currency')
      .contains('strong', currentCurrency)
      .should('be.visible');

    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]')
      .type(depositAmount);
    cy.contains('[type="submit"]', 'Deposit')
      .click();
    cy.get('[ng-show="message"]')
      .should('contain', 'Deposit Successful');

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .should('contain', startBalance + parseInt(depositAmount))
      .should('be.visible');

    cy.get('[ng-click="withdrawl()]')
      .click();
    cy.get('[placeholder="amount"]')
      .type(withdrawAmount);

    cy.contains('.btn[type="submit"]', 'Withdraw')
      .click();

    cy.get('[ng-show="message"]')
      .should('contain', 'Transaction successful');

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', actualBalance)
      .should('be.visible');

    cy.get('[ng-click="transaction()"]')
      .click();
    cy.get('td.ng-binging')
      .should('contain', depositAmount);
    cy.get('td.ng-binging')
      .should('contain', withdrawAmount);
    cy.get('[ng-click="back()"]')
      .click();

    cy.get('#accountSelect')
      .select('1001');

    cy.get('[ng-click="transactions()"]')
      .click();
    cy.get('td.ng-binding')
      .should('not.exist');
    cy.get('[ng-show="logout"]')
      .click();
    cy.get('#userSelect')
      .should('be.visible');
  });
});
