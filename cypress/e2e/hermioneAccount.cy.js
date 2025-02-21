/// <reference types='cypress' />

import { faker } from '@faker-js/faker';
import LoginPageObj from '../pageObjects/loginPageObj.js';
import CustomerPageObj from '../pageObjects/customerPageObj.js';
import AccountPageObj from '../pageObjects/accountPageObj.js';
import TransactionsPageObj from '../pageObjects/transactionsPageObj.js';

const customerPageObj = new CustomerPageObj();
const loginPageObj = new LoginPageObj();
const accountPageObj = new AccountPageObj();
const transactionsPageObj = new TransactionsPageObj();

const depositAmount = faker.number.int({ min: 1, max: 10000 });
const accountNumber = 1001;
const withdrawlAmount = faker.number.int({ min: 1, max: depositAmount });

describe('Bank app', () => {
  beforeEach(() => {
    cy.visit('/#/login');
  });

  it('should provide the ability to work with Hermione\'s bank account',
    { scrollBehavior: false },
    () => {
      let mainBalance;
      loginPageObj.clickCustomerLoginBtn();

      cy.assureUrl('#/customer');
      customerPageObj.selectCustomer('Hermoine Granger');
      customerPageObj.clickLoginBtn();

      cy.get('.center strong.ng-binding')
        .eq(1)
        .invoke('text')
        .then((balance) => {
          mainBalance = +balance;
          accountPageObj.assertAccountNumber(accountNumber);
          accountPageObj.assertBalance(mainBalance);
          accountPageObj.assertCurrency('Dollar');
          // DEPOSIT
          accountPageObj.clickOperationType('Deposit');
          accountPageObj.insertAmount(depositAmount);
          accountPageObj.clickSubmitBtn('Deposit');

          accountPageObj.assertMessage('Deposit Successful');
          mainBalance = depositAmount + mainBalance;
          accountPageObj.assertBalance(mainBalance);
          // WITHDRAWL
          accountPageObj.clickOperationType('Withdrawl');
          accountPageObj.assertFieldName('Amount to be Withdrawn :');
          accountPageObj.insertAmount(withdrawlAmount);
          accountPageObj.clickSubmitBtn('Withdraw');
          accountPageObj.assertMessage('Transaction successful');
          mainBalance = mainBalance - withdrawlAmount;
          // Assert Balance
          accountPageObj.assertBalance(mainBalance);
          // Click **[Transacrions]**
          accountPageObj.clickOperationType('Transactions');
          // Assert both transactions details
          transactionsPageObj.clickTableHead('a', 'Date-Time');
          transactionsPageObj
            .assertTableRowData('tr#anchor0', 1, withdrawlAmount);
          transactionsPageObj
            .assertTableRowData('tr#anchor0', 2, 'Debit');
          transactionsPageObj
            .assertTableRowData('tr#anchor1', 1, depositAmount);
          transactionsPageObj
            .assertTableRowData('tr#anchor1', 2, 'Credit');

          // Click **[Back]**
          transactionsPageObj.clickBackBtn();

          // Change Account number
          accountPageObj.changeAccoutNoTo('1002');
          // Click **[Transacrions]**
          accountPageObj.clickOperationType('Transactions');
          // Assert no transactions for this account
          transactionsPageObj.assureTableEmpty();

          // Click **[Logout]**
          accountPageObj.logout();
          // Assert user is logged out
          cy.assureUrl('#/customer');

          customerPageObj.userSelector
            .should('have.class', 'ng-untouched');
          customerPageObj.userSelector
            .should('not.have.class', 'ng-touched');
        });
    });
});
