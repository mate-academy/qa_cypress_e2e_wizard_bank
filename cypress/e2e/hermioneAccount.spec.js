/// <reference types='cypress' />
const { faker } = require('@faker-js/faker');

describe('Bank app', () => {
  const EC = protractor.ExpectedConditions;
  const customerName = 'Hermoine Granger';

  let initialBalance;
  const depositAmount = faker.datatype.number({ min: 100, max: 1000 });
  const withdrawAmount = faker.datatype.number({ min: 10, max: depositAmount });

  beforeAll(async () => {
    await browser.get('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login');
    await element(by.buttonText('Customer Login')).click();
    await element(by.model('custId')).element(by.cssContainingText('option', customerName)).click();
    await element(by.buttonText('Login')).click();
  });

  it('should validate initial account details', async () => {
    const accountNo = await element(by.binding('accountNo')).getText();
    expect(accountNo).toMatch(/^\d+$/);

    const currency = await element(by.binding('currency')).getText();
    expect(currency).toBe('Dollar');

    initialBalance = parseInt(await element(by.binding('balance')).getText());
    expect(initialBalance).toBeGreaterThanOrEqual(0);
  });

  it('should perform deposit and validate success', async () => {
    await element(by.buttonText('Deposit')).click();
    await element(by.model('amount')).sendKeys(depositAmount);
    await element(by.css('form[name="myForm"] button')).click();

    const successMsg = await element(by.css('.error')).getText();
    expect(successMsg).toContain('Deposit Successful');

    const balanceAfterDeposit = parseInt(await element(by.binding('balance')).getText());
    expect(balanceAfterDeposit).toBe(initialBalance + depositAmount);
    initialBalance = balanceAfterDeposit;
  });

  it('should withdraw funds and validate success', async () => {
    await element(by.buttonText('Withdrawl')).click();
    await element(by.model('amount')).sendKeys(withdrawAmount);
    await element(by.css('form[name="myForm"] button')).click();

    const successMsg = await element(by.css('.error')).getText();
    expect(successMsg).toContain('Transaction successful');

    const balanceAfterWithdraw = parseInt(await element(by.binding('balance')).getText());
    expect(balanceAfterWithdraw).toBe(initialBalance - withdrawAmount);
    initialBalance = balanceAfterWithdraw;
  });

  it('should verify transactions log', async () => {
    await element(by.buttonText('Transactions')).click();
    const transactions = await element.all(by.repeater('tx in transactions'));

    const depositTx = transactions.filter(async (tx) => {
      const txText = await tx.getText();
      return txText.includes(depositAmount.toString());
    });
    const withdrawTx = transactions.filter(async (tx) => {
      const txText = await tx.getText();
      return txText.includes(withdrawAmount.toString());
    });

    expect(await depositTx.count()).toBeGreaterThan(0);
    expect(await withdrawTx.count()).toBeGreaterThan(0);

    await element(by.buttonText('Back')).click();
  });

  it('should check empty transactions on a different account', async () => {
    const options = element.all(by.css('#accountSelect option'));
    await options.get(1).click(); // assume second account has no activity
    await element(by.buttonText('Transactions')).click();

    const emptyMessage = element(by.cssContainingText('strong', 'No Transactions Found'));
    expect(await emptyMessage.isPresent()).toBe(true);

    await element(by.buttonText('Back')).click();
  });

  it('should logout successfully', async () => {
    await element(by.buttonText('Logout')).click();
    expect(await element(by.buttonText('Your Name')).isPresent()).toBe(true);
  });
});
