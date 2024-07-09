import { faker } from '@faker-js/faker';

const moment = require('moment');

function accountData() {
  const depositAmount = faker.number.int({ min: 500, max: 1000 });
  const withdrawAmount = faker.number.int({ min: 50, max: 500 });
  const currentBalance = 5096;
  const balanceAfterDeposit = currentBalance + depositAmount;
  const balanceAfterWithdrow = currentBalance + depositAmount - withdrawAmount;
  const user = 'Hermoine Granger';
  const accountNumber = ['1001', '1002'];
  const currency = 'Dollar';
  const date = moment().format('YYYY-MM-DDT00:00:00');

  return {
    user,
    accountNumber,
    currency,
    depositAmount,
    withdrawAmount,
    currentBalance,
    balanceAfterDeposit,
    balanceAfterWithdrow,
    date
  };
}

module.exports = { accountData };
