import { faker } from '@faker-js/faker';
/// <reference types='cypress' />
const { assert } = require('chai');
describe('Bank app of Hermione Granger', () => {
  const depositAmount = faker.number.int({ min: 500, max: 10000 });
  const withdrawAmount = faker.number.int({ min: 50, max: 5000 });
  const user = 'Hermoine Granger';
  const accountNumber1 = '1001';
  const startBalance = 5096;
  const expectedBalanceAfterDeposit = startBalance + depositAmount;
  const finishBalance = expectedBalanceAfterDeposit - withdrawAmount;

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    // Крок 1-3: Login
    cy.contains('.btn', 'Customer Login').click();
    cy.get('[name="userSelect"]').select(user);
    cy.contains('.btn', 'Login').click();

    let startBalance;

    cy.get('.borderM strong.ng-binding').eq(1) // A more specific selector for balance
      .invoke('text')
      .then((balanceText) => {
        startBalance = parseInt(balanceText, 10);

        // Крок 4-6: Перевірка accountNumber
        cy.contains('[ng-hide="noAccount"]', 'Account Number')
          .contains('strong', accountNumber1)
          .should('be.visible');

        cy.contains('[ng-hide="noAccount"]', 'Balance')
          .contains('strong', startBalance.toString())
          .should('be.visible');

        cy.contains('.ng-binding', 'Dollar')
          .should('be.visible');

        cy.get('[ng-click="deposit()"]').click();
        cy.get('[placeholder="amount"]').type(depositAmount);
        cy.contains('[type="submit"]', 'Deposit').click();

        cy.get('[ng-show="message"]')
          .should('contain', 'Deposit Successful');
        cy.contains('[ng-hide="noAccount"]', 'Balance')
          .find('strong')
          .should('contain', expectedBalanceAfterDeposit.toString());

        cy.get('[ng-click="withdrawl()"]').click();
        cy.contains('[type="submit"]', 'Withdraw')
          .should('be.visible');
        cy.get('[placeholder="amount"]').type(withdrawAmount);
        cy.contains('[type="submit"]', 'Withdraw').click();

        cy.get('[ng-show="message"]')
          .should('contain', 'Transaction successful');
        cy.contains('[ng-hide="noAccount"]', 'Balance')
          .find('strong')
          .should('contain', finishBalance.toString());

        // Transactions
        cy.get('[ng-click="transactions()"]').click();

        // Очікування таблиці транзакцій
        cy.get('table tbody', { timeout: 10000 })
          .should('have.length.greaterThan', 0);

        // Перевірка, що транзакції з'явилися в таблиці
        cy.get('table tbody')
          .should('contain.text', 'Credit')
          .and('contain.text', depositAmount.toString());

        cy.get('table tbody')
          .should('contain.text', 'Debit')
          .and('contain.text', withdrawAmount.toString());

        // Після перевірки транзакцій
        cy.get('[ng-click="back()"]').click();

        // Перемикаємось на інший акаунт, якщо є
        cy.get('[name="accountSelect"] option')
          .should('have.length.greaterThan', 1) // важливо: гарантуємо, що є інші акаунти
          .then(($options) => {
            const options = Array.from($options);
            const current = accountNumber1;

            // Знаходимо інший акаунт
            const other = options.find(
              (opt) => opt.value !== current && opt.value !== '');

            assert.exists(other, 'інший акаунт має бути знайдений');

            const otherAccount = other.value;
            cy.log(`Перемикаємось на інший акаунт: ${otherAccount}`);

            // Перемикаємось
            cy.get('[name="accountSelect"]').select(otherAccount);

            // Переконуємось, що акаунт змінився
            cy.get('[name="accountSelect"]')
              .find(':selected')
              .should('have.value', otherAccount);

            // Переходимо до транзакцій
            cy.get('[ng-click="transactions()"]').click();

            // Чекаємо появи таблиці
            cy.get('table tbody', { timeout: 5000 }).should('exist');

            // Перевіряємо, чи інші транзакції
            cy.get('table tbody').then(($tbody) => {
              const text = $tbody.text();

              if (
                text.includes(depositAmount.toString()) ||
            text.includes(withdrawAmount.toString())
              ) {
                cy.log(
                  '⚠️ Інший акаунт містить такі самі транзакції.' +
              'Можливо, транзакції не фільтруються.'
                );
              } else {
                cy.log(
                  '✅ Транзакції у іншому акаунті відрізняються або відсутні.');
              }
            });
          });
        // Logout і повернення на головний екран
        cy.get('[ng-click="byebye()"]').click();
        cy.get('.home').click(); // ← Додано

        // Перевірка, що ми на головній
        cy.contains('.btn', 'Customer Login', { timeout: 10000 })
          .should('be.visible');
      });
  });
});
