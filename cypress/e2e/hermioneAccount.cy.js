import { faker } from '@faker-js/faker';
import BankUserObject from '../support/BankUser.Object';
import { countTransactions } from '../support/functions';
/// <reference types='cypress' />

const bankUser = new BankUserObject();

describe('Bank User', () => {
  let beforeDeposit = 0;
  let afterDeposit = 0;
  let beforeWithdrawal = 0;
  let afterWithdrawal = 0;
  const withdrawAmount = `${faker.number.int({ min: 50, max: 500 })}`;
  const depositAmount = `${faker.number.int({ min: 501, max: 2000 })}`;
  const user = 'Hermoine Granger';
  const accountNumber = '1001';

  beforeEach(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with bank account', () => {
    bankUser.clickCustomerLogin();
    bankUser.selectUser(user);
    bankUser.clickLoginBtn();
    bankUser.assertTransactionPage(beforeDeposit);

    bankUser.assertAccountNumber(accountNumber);
    bankUser.selectAccount('1002');
    bankUser.assertCurrency('Pound');
    bankUser.balanceSelector
      .invoke('text')
      .then((text) => {
        const balanceText = text.replace('Balance: ', '').trim();
        beforeDeposit = balanceText;
      });

    bankUser.clickDepositBtn();
    bankUser.typeAmount(depositAmount);
    bankUser.submitTransaction();

    bankUser.balanceSelector
      .invoke('text')
      .then((text) => {
        const balanceText = text.replace('Balance: ', '').trim();
        afterDeposit = balanceText;

        expect((Number(beforeDeposit) +
         Number(depositAmount)).toString()).to.equal(afterDeposit);
      });

    bankUser.clickTransactionsBtn();
    countTransactions();
    cy.get('@transactions').then((transactions) => {
      bankUser.assertDepositInTransactions(transactions, depositAmount);
    });
    bankUser.clickBackBtn();
    bankUser.clickWithdrawalBtn();
    bankUser.balanceSelector
      .invoke('text')
      .then((text) => {
        const balanceText = text.replace('Balance: ', '').trim();
        beforeWithdrawal = balanceText;
      });
    bankUser.typeAmount(withdrawAmount);
    bankUser.clickSubmitBtn();
    bankUser.balanceSelector
      .invoke('text')
      .then((text) => {
        const balanceText = text.replace('Balance: ', '').trim();
        afterWithdrawal = balanceText;
        expect((Number(beforeWithdrawal) -
         Number(withdrawAmount)).toString()).to.equal(afterWithdrawal);
      });
    bankUser.clickTransactionsBtn();
    countTransactions();
    cy.get('@transactions').then((transactions) => {
      bankUser.assertWithdrawalsInTransactions(transactions, withdrawAmount);
    });

    bankUser.clickLogoutBtn();
    bankUser.assertLogoutUser();
  });
});
