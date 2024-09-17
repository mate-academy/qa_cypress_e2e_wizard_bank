const { faker } = require('@faker-js/faker');

function generateRandomNumber() {
  const randomNumber = faker.number.int({ min: 0, max: 5096 });
  return randomNumber;
}

module.exports = { generateRandomNumber };
