const { faker } = require('@faker-js/faker');

function generateNew() {
  const user = 'Hermoine Granger';
  const accountNumber = '1001';
  const deposit = faker.number.int({ min: 1000, max: 2500 });
  const withdrawl = faker.number.int({ min: 500, max: 2000 });
  const currency = 'Dollar';
  return {
    user,
    deposit,
    accountNumber,
    currency,
    withdrawl
  };
}

module.exports = { generateNew };
