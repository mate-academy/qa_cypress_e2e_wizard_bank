module.exports = { generateUserData };

function generateUserData() {
  const names = ['Hermoine Granger', 'Harry Potter', 'Ron Weasly'];
  const inputMoneyAmount = Math.floor(Math.random() * 10000) + 1;

  return {
    names,
    inputMoneyAmount
  };
};
