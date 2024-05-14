import { faker } from '@faker-js/faker';
/// <reference types='cypress' />

describe('Bank app', () => {
  const depositAmount = `${faker.number.int({ min: 500, max: 1000 })}`;
  const withdrawAmount = `${faker.number.int({ min: 50, max: 500 })}`;
  const balance = depositAmount - withdrawAmount;
  const user = 'Hermoine Granger';
  const accountNumber = '1002';

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermoine\'s bank account', () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('[name="userSelect"]').select(user);
    cy.contains('.btn', 'Login').click();
    
    cy.get('#accountSelect').select('1002');
    
    cy.contains('[ng-hide="noAccount"]', 'Account Number')
    .contains('strong', accountNumber)
    .should('be.visible');
    
    cy.contains('[ng-hide="noAccount"]', 'Balance')
    .contains('strong', '0')
    .should('be.visible');
    
    cy.contains('.ng-binding', 'Pound')
    .should('be.visible');
    
    cy.get('[ng-click="deposit()"]').click();
    cy.get('[placeholder="amount"]').type(depositAmount);
    cy.contains('[type="submit"]', 'Deposit').click();
    cy.get('[ng-show="message"]').should('contain', 'Deposit Successful');

    cy.contains('[ng-hide="noAccount"]', 'Balance')
    .contains('strong', depositAmount)
    .should('be.visible');
    
    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw').should('be.visible');
    cy.get('[placeholder="amount"]').type(withdrawAmount);
    cy.contains('[type="submit"]', 'Withdraw').click();
    cy.get('[ng-show="message"]').should('contain', 'Transaction successful');

    cy.contains('[ng-hide="noAccount"]', 'Balance')
    .contains('strong', balance.toString())
    .should('be.visible');
    
    cy.get('[ng-class="btnClass1"]').click();

    cy.url().should('eq', 'https://www.globalsqa.com/angularJs-protractor/BankingProject/#/listTx');
    cy.get('.fixedTopBox > [style="float:left"]').click();
    cy.get('[ng-class="btnClass1"]').click();
    cy.get('tbody tr:nth-child(1) td:nth-child(2)').should('contain', depositAmount);
    cy.get('tbody tr:nth-child(2) td:nth-child(2)').should('contain', withdrawAmount);

    cy.contains('.btn', 'Back').click();

    cy.get('[name="accountSelect"]').select('1003');
    cy.contains('[ng-click="transactions()"]', 'Transactions').click();
    cy.get('tbody tr:nth-child(1) td:nth-child(2)').should('not.exist');
    cy.get('tbody tr:nth-child(2) td:nth-child(2)').should('not.exist');

    cy.contains('Logout').click();
    
    cy.url().should('eq', 'https://www.globalsqa.com/angularJs-protractor/BankingProject/#/customer');
  });
});