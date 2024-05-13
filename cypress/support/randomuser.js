import { faker } from '@faker-js/faker';

function User() {
  const depositAmount = faker.number.int({ min: 500, max: 1000 });
  const withdrawAmount = faker.number.int({ min: 50, max: 500 });
  const Startbalance = 5096;
  const bal = Startbalance + depositAmount;
  const balance = (Startbalance + depositAmount) - withdrawAmount;
  const user = 'Hermoine Granger';
  const accountNumber = '1001';
  const currency = 'Dollar';

  return {
    depositAmount,
    withdrawAmount,
    balance,
    Startbalance,
    user,
    accountNumber,
    currency,
    bal
  };
}

module.exports = { User };
