import { faker } from '@faker-js/faker';

const user = 'Hermoine Granger';
const accountNumber = 1001;
const startBalance = 5096;
const currency = 'Dollar';
const depositAmount = `${faker.number.int({ min: 10, max: 2000 })}`;
const withdrawAmount = `${faker.number.int({ min: 100, max: 5000 })}`;
const actualBalance =
startBalance + parseInt(depositAmount) - parseInt(withdrawAmount);

module.exports = {
  user,
  accountNumber,
  startBalance,
  currency,
  depositAmount,
  withdrawAmount,
  actualBalance
};
