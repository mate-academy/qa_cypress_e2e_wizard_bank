import { faker } from '@faker-js/faker';
/// <reference types='cypress' />

describe('Bank app', () => {
  const DATA_USER = {
    name: 'Hermoine Granger',
    accountNumber: '1002',
    currency: 'Pound',
    balance: 0,
    depositAmount: faker.number.int({ min: 500, max: 1000 }),
    withdrawAmount: faker.number.int({ min: 50, max: 500 })
  };

  before(() => {
    cy.visit('/');
    cy.location('protocol').should('eq', 'https:');
    cy.title().should('eq', 'XYZ Bank');
  });

  it(`should provide the ability to work with Hermione's bank account`, () => {
    cy.clickButton('Customer Login');
    cy.selectDropdownValue('select', DATA_USER.name);
    cy.pressSubmitButton();
    cy.selectDropdownValue('#accountSelect', DATA_USER.accountNumber);

    cy.checkAccountInfo('Account Number', DATA_USER.accountNumber);
    cy.checkAccountInfo('Balance', DATA_USER.balance.toString());
    cy.checkAccountInfo('Currency', DATA_USER.currency);

    cy.clickButton('Deposit');
    cy.findSubmitButton('Deposit');
    cy.typeInput('number', DATA_USER.depositAmount);
    cy.pressSubmitButton();
    cy.verifyMessage('Deposit Successful');
    DATA_USER.balance += DATA_USER.depositAmount;
    cy.checkAccountInfo('Balance', DATA_USER.balance.toString());

    cy.clickButton('Withdrawl');
    cy.findSubmitButton('Withdraw');
    cy.typeInput('number', DATA_USER.withdrawAmount);
    cy.pressSubmitButton();
    cy.verifyMessage('Transaction successful');
    DATA_USER.balance -= DATA_USER.withdrawAmount;
    cy.checkAccountInfo('Balance', DATA_USER.balance.toString());

    cy.clickButton('Transactions');
    cy.assertURLContains('/listTx');
    cy.get('table > tbody').should('not.be.visible');

    cy.clickButton('Logout');
    cy.assertURLContains('/customer');
  });
});
