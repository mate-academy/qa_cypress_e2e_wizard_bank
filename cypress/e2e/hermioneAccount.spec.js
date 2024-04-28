import { faker } from '@faker-js/faker';
/// <reference types='cypress' />

function generateData() {
  const depositAmount = `${faker.number.int({ min: 500, max: 1000 })}`;
  const withdrawAmount = `${faker.number.int({ min: 50, max: 500 })}`;
  const startBalance = 5096;
  const balance = startBalance + parseInt(depositAmount);
  const balanceAfterWithdrow = balance - parseInt(withdrawAmount);
  const user = 'Hermoine Granger';
  const accountNumber = '1001';

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}T00:00`;

  return {
    depositAmount,
    withdrawAmount,
    balance,
    user,
    accountNumber,
    balanceAfterWithdrow,
    formattedDate
  };
}

module.exports = { generateData };
