/// <reference types='cypress' />

import { faker } from '@faker-js/faker';

const customer = 'Harry Potter';
const accountNumber = '1004';
const accountDetails = '[ng-hide="noAccount"] strong';

const getBalance = () => {
  return cy.get(accountDetails)
    .eq(1)
    .invoke('text')
    .then((text) => Number(text.trim()));
};

const loginAsCustomer = () => {
  cy.get('button[ng-click="customer()"]')
    .should('be.visible')
    .click();

  cy.get('#userSelect')
    .should('be.visible')
    .select(customer);

  cy.get('button[type="submit"]')
    .should('be.visible')
    .and('be.enabled')
    .click();

  cy.get('#accountSelect')
    .should('be.visible')
    .select(accountNumber);
};

const deposit = (amount) => {
  const input =
    'form[ng-submit="deposit()"] input[placeholder="amount"]';
  const submit =
    'form[ng-submit="deposit()"] button[type="submit"]';

  cy.get('button[ng-click="deposit()"]')
    .should('be.visible')
    .click();

  cy.get(input)
    .should('be.visible')
    .and('be.enabled');

  cy.get(input)
    .clear();

  cy.get(input)
    .type(String(amount));

  cy.get(submit)
    .should('be.visible')
    .and('be.enabled')
    .click();

  cy.get('[ng-show="message"]')
    .should('be.visible')
    .and('contain.text', 'Deposit Successful');
};

const withdraw = (amount) => {
  const input =
    'form[ng-submit="withdrawl()"] input[placeholder="amount"]';
  const submit =
    'form[ng-submit="withdrawl()"] button[type="submit"]';

  cy.get('button[ng-click="withdrawl()"]')
    .should('be.visible')
    .click();

  cy.get(input)
    .should('be.visible')
    .and('be.enabled');

  cy.get(input)
    .clear();

  cy.get(input)
    .type(String(amount));

  cy.get(submit)
    .should('be.visible')
    .and('be.enabled')
    .click();

  cy.get('[ng-show="message"]')
    .should('be.visible')
    .and('contain.text', 'Transaction successful');
};

describe('Wizard Bank - advanced faker flow', () => {
  it('uses generated amounts with another customer account', () => {
    const depositAmount = faker.number.int({ min: 500, max: 1000 });
    const withdrawAmount = faker.number.int({
      min: 50,
      max: depositAmount - 1
    });

    cy.visit('/#/login');
    loginAsCustomer();

    cy.get(accountDetails)
      .eq(0)
      .should('contain.text', accountNumber);

    cy.get(accountDetails)
      .eq(2)
      .should('contain.text', 'Dollar');

    getBalance().then((initialBalance) => {
      expect(initialBalance, 'initial account balance').to.equal(0);

      deposit(depositAmount);

      getBalance().then((balanceAfterDeposit) => {
        expect(balanceAfterDeposit).to.equal(depositAmount);
      });

      withdraw(withdrawAmount);

      getBalance().then((finalBalance) => {
        expect(finalBalance).to.equal(
          depositAmount - withdrawAmount
        );
      });
    });
  });
});
