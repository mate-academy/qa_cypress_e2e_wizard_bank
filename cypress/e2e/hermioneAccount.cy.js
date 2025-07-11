/// <reference types='cypress' />
import { faker } from '@faker-js/faker';

describe('Bank app', () => {
  const depositAmount = `${faker.number.int({ min: 500, max: 1000 })}`;
  const withdrawAmount = `${faker.number.int({ min: 50, max: 500 })}`;
  let balance;
  const currency = 'Dollar';
  const user = 'Hermoine Granger';
  const accountNumber = '1001';
  const nextAccountNumber = (Number(accountNumber) + 1) <= 1003
    ? (Number(accountNumber) + 1)
    : '1001';

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    // log In
    cy.contains('.btn', 'Customer Login').click();
    cy.get('#userSelect').select(user);
    cy.contains('.btn', 'Login').click();

    // assert correct data are at the top of the page
    cy.contains('strong', 'Welcome')
      .find('span')
      .should('be.visible')
      .and('have.text', user);

    cy.get('#accountSelect')
      .should('have.value', `number:${accountNumber}`)
      .should('be.visible');

    // Assert correct account info
    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .find('strong')
      .eq(0)
      .should('be.visible')
      .and('have.text', `${accountNumber} `);

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .find('strong')
      .eq(1)
      .should('be.visible')
      .invoke('text')
      .then((balanceText) => {
        balance = balanceText.trim();
        cy.log('Balance:', balance);
      });

    cy.contains('[ng-hide="noAccount"]', 'Currency')
      .find('strong')
      .eq(2)
      .should('be.visible')
      .and('contain.text', currency);

    // Save initial balance
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .find('strong')
      .eq(1)
      .invoke('text')
      .then((balanceText) => {
        balance = balanceText;
      });

    // Add deposit
    cy.contains('button', 'Deposit').click();
    cy.get('label')
      .should('be.visible')
      .and('contain.text', 'Amount to be Deposited');
    cy.get('[placeholder="amount"]').type(depositAmount);
    cy.contains('button[type="submit"]', 'Deposit').click();
    cy.then(() => {
      cy.contains('span.error', 'Deposit Successful');
      cy.contains('[ng-hide="noAccount"]', 'Balance')
        .find('strong')
        .eq(1)
        .should('be.visible')
        .invoke('text')
        .then((newBalance) => {
          balance = (Number(balance) + Number(depositAmount)).toString();
          expect(Number(newBalance)).to.eq(Number(balance));
        });

      // Add withdraw
      cy.contains('button', 'Withdrawl').click();
      cy.get('label')
        .should('be.visible')
        .and('contain.text', 'Amount to be Withdrawn');
      cy.get('[placeholder="amount"]').type(withdrawAmount);
      cy.contains('button[type="submit"]', 'Withdraw').click();
      cy.then(() => {
        cy.contains('span.error', 'Transaction successful');
        cy.contains('[ng-hide="noAccount"]', 'Balance')
          .find('strong')
          .eq(1)
          .should('be.visible')
          .invoke('text')
          .then((newBalance) => {
            balance = (Number(balance) - Number(withdrawAmount)).toString();
            expect(Number(newBalance)).to.eq(Number(balance));
          });

        // transaction check
        cy.contains('button', 'Transactions').click();
        cy.then(() => {
          cy.url().should('include', '/#/listTx');
          cy.contains('td', 'Date-Time').should('be.visible');
          cy.get('tbody').should('be.visible');
          cy.get('tbody').find('tr', { timeout: 10000 }).then(($rows) => {
            const rowsArray = Array.from($rows);
            cy.get(`#anchor${rowsArray.length - 1}`)
              .find('td')
              .eq(1)
              .should('contain.text', withdrawAmount);
            cy.get(`#anchor${rowsArray.length - 2}`)
              .find('td')
              .eq(1)
              .should('contain.text', depositAmount);
          });

          cy.contains('button', 'Back').click();
          cy.then(() => {
            cy.url().should('include', '/#/account');
            cy.get('#accountSelect').select(`number:${nextAccountNumber}`);
            cy.contains('button', 'Transactions').click();
            cy.url().should('include', '/#/listTx');
            cy.get('tbody').should('not.be.visible');
            cy.contains('button', 'Logout').click();
            cy.url().should('include', '/#/customer');
            cy.get('label')
              .should('be.visible')
              .should('contain.text', 'Your Name');
          });
        });
      });
    });
  });
});
