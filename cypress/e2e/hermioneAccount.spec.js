/// <reference types='cypress' />
import HomePageObject from '../pageObjects/homePageObject';
import HeaderObject from '../pageObjects/headerObject';
import DepositPageObject from '../pageObjects/depositPageObject';
import AccountPageObject from '../pageObjects/accountPageObject';
import TransactionsPageObject from '../pageObjects/transactionsPageObject';
import WithdrawalPageObject from '../pageObjects/withdrawalPageObject';

describe('Bank app', () => {
  const customerName = 'Hermione Granger';
  const accountNumber = '1001';
  const currentBalance = '5096';
  const currency = 'Dollar';
  const depositAmount = '1000';
  const withdrawalAmount = '500';
  const balanceAfterDeposit = '6096';
  const balanceAfterWithdrawal = '5596';
  const depositSuccessMessage = 'Deposit Successful';
  const withdrawSuccessMessage = 'Transaction successful';

  before(() => {
    const header = new HeaderObject();
    const homePage = new HomePageObject();

    cy.visit('/');
    header.verifyTitle();
    homePage.clickCustomerLoginButton();
    homePage.selectCustomerName();
    homePage.clickLoginButton();
  });

  it('should allow Hermione to view her account details', () => {
    const accountPage = new AccountPageObject();

    accountPage.verifyAccountNumber(accountNumber);
    accountPage.verifyAccountBalance(currentBalance);
    accountPage.verifyCurrency(currency);
    accountPage.verifyCustomerName(customerName);
  });

  it('should allow Hermione to deposit money', () => {
    const depositPage = new DepositPageObject();

    depositPage.enterDepositAmount(depositAmount);
    depositPage.clickDepositButton();
    depositPage.verifyDepositSuccessMessage(depositSuccessMessage);
    depositPage.verifyBalanceAfterDeposit(balanceAfterDeposit);
  });

  it('should allow Hermione to withdraw money', () => {
    const accountPage = new AccountPageObject();
    const withdrawalPage = new WithdrawalPageObject();

    accountPage.clickWithdrawButton();

    withdrawalPage.enterWithdrawalAmount(withdrawalAmount);
    withdrawalPage.clickWithdrawalButton();
    withdrawalPage.verifyWithdrawalSuccessMessage(withdrawSuccessMessage);
    withdrawalPage.verifyBalanceAfterWithdrawal(balanceAfterWithdrawal);
  });

  it('should allow Hermione to view her account transactions', () => {
    const accountPage = new AccountPageObject();
    const transactionsPage = new TransactionsPageObject();

    accountPage.clickTransactionsButton();

    transactionsPage.verifyTransactionTableExists();
    transactionsPage.verifyTransactionTableHeader('Date-Time');
    transactionsPage.verifyTransactionTableHeader('Amount');
    transactionsPage.verifyTransactionTableHeader('Transaction Type');
    transactionsPage.verifyTransactionRowCount(7);
    transactionsPage.verifyBackButton();
    transactionsPage.verifyResetButton();
  });

  after(() => {
    const header = new HeaderObject();
    const homePage = new HomePageObject();

    header.clickLogoutButton();
    header.clickHomeButton();
    homePage.verifyCustomerLoginButton();
  });
});
