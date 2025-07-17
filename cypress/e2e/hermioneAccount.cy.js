/// <reference types="cypress" />
import { faker } from '@faker-js/faker'; // Імпортуємо faker для генерації даних

describe('Hermione Granger Bank Account Flow', () => {
  // Визначаємо змінні для сум депозиту та зняття, а також для користувача
  const depositAmount = faker.number.int({ min: 500, max: 1000 });
  // Забезпечуємо, щоб можна було зняти
  const withdrawAmount = faker.number.int(
    { min: 50, max: depositAmount - 100 }
  );
  const user = 'Hermione Granger';
  const currency = 'Dollar'; // Валюта для перевірки

  // Змінні для зберігання балансу та номерів рахунків
  let initialBalance = 0;
  let currentBalance = 0;
  let accountNumber1; // Перший номер рахунку
  let accountNumber2; // Другий номер рахунок (для зміни рахунку)

  beforeEach(() => {
    // Відвідуємо сторінку входу перед кожним тестом
    // baseUrl вже налаштовано в cypress.config.js
    cy.visit('/#/login');
  });

  it('should check Hermione Granger bank account flow', () => {
    // 1. Клік [Customer Login]
    cy.contains('.btn', 'Customer Login').click();

    // 2. Вибір Hermione Granger
    cy.get('#userSelect').select(user);

    // 3. Клік [Login]
    cy.contains('.btn', 'Login').click();

    // Перевіряємо, що ми увійшли в акаунт користувача
    cy.contains('div.center', `Welcome ${user}`).should('be.visible');

    // Отримуємо початковий номер рахунку та баланс
    cy.get('.account-number strong').first().then(($accountNumber) => {
      accountNumber1 = $accountNumber.text();
      cy.log(`Initial Account Number: ${accountNumber1}`);
    });

    cy.get('.center strong').eq(1).then(($balance) => {
      initialBalance = parseFloat($balance.text());
      currentBalance = initialBalance;
      cy.log(`Initial Balance: ${initialBalance}`);
    });

    // 4. Assert Account Number (e.g. 1001)
    cy.get('.account-number strong').first().should('be.visible');

    // 5. Assert Balance
    cy.get('.center strong')
      .eq(1)
      .should('have.text', initialBalance.toString()); // <--- Виправлено max-len

    // 6. Assert Currency
    cy.get('.center strong').eq(2).should('have.text', currency);

    // 7. Клік [Deposit]
    cy.get('[ng-click="deposit()"]').click();
    cy.contains('label', 'Amount to be Deposited').should('be.visible');

    // 8. Type deposit value
    cy.get('[placeholder="amount"]').type(depositAmount.toString());

    // 9. Клік [Deposit]
    cy.contains('[type="submit"]', 'Deposit').click();

    // 10. Assert success message
    cy.get('.error').should('contain.text', 'Deposit Successful');

    // Оновлюємо очікуваний баланс
    currentBalance += depositAmount;

    // 11. Assert Balance
    cy.get('.center strong')
      .eq(1)
      .should('have.text', currentBalance.toString());

    // 12. Клік [Withdrawl]
    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('label', 'Amount to be Withdrawn').should('be.visible');

    // Перевіряємо, що ми можемо зняти кошти
    cy.get('[placeholder="amount"]').type(withdrawAmount.toString());

    // 13. Клік [Withdraw]
    cy.contains('[type="submit"]', 'Withdraw').click();

    // 14. Assert success message
    cy.get('.error').should('contain.text', 'Transaction successful');

    // Оновлюємо очікуваний баланс
    currentBalance -= withdrawAmount;

    // 15. Assert Balance
    cy.get('.center strong')
      .eq(1)
      .should('have.text', currentBalance.toString());

    // 16. Клік [Transactions]
    cy.get('[ng-click="transactions()"]').click();
    cy.url().should('include', '/listTx');
    cy.contains('strong', 'Transactions for Account :').should('be.visible');

    // 17. Assert both transactions details: Deposit and Withdraw
    cy.get('tbody tr').should('have.length', 2); // Очікуємо дві транзакції

    // Перевірка депозиту
    cy.get('tbody tr').eq(0).within(() => {
      cy.get('td').eq(1).should('have.text', depositAmount.toString());
      cy.get('td').eq(2).should('have.text', 'Credit');
    });

    // Перевірка зняття
    cy.get('tbody tr').eq(1).within(() => {
      cy.get('td').eq(1).should('have.text', withdrawAmount.toString());
      cy.get('td').eq(2).should('have.text', 'Debit');
    });

    // 18. Клік [Back]
    cy.contains('.btn', 'Back').click();
    cy.url().should('include', '/account'); // Повертаємося на сторінку акаунта

    // 19. Change Account number
    // Знаходимо другий доступний рахунок (якщо є)
    cy.get('#accountSelect').find('option').eq(1).then(($option) => {
      accountNumber2 = $option.val();
      if (accountNumber2 && accountNumber2 !== accountNumber1) {
        cy.get('#accountSelect').select(accountNumber2);
        cy.log(`Changed to Account Number: ${accountNumber2}`);
      } else {
        // Якщо немає другого рахунку, або він такий же, використовуємо перший
        cy.log(
          'Only one account available or second account is same. ' +
          'Using the first.' // <--- Виправлено max-len
        );
        accountNumber2 = accountNumber1; // Залишаємося на тому ж рахунку для тесту
      }
    });

    // 20. Клік [Transactions] для нового рахунку
    cy.get('[ng-click="transactions()"]').click();
    cy.url().should('include', '/listTx');

    // 21. Assert no transactions for this account
    // Перевіряємо, що таблиця транзакцій порожня
    cy.get('tbody').find('tr').should('have.length', 0);
    // Або перевіряємо повідомлення "No Transactions" якщо воно є
    cy.contains('strong', 'Transactions for Account :').should('be.visible');

    // 22. Клік [Logout]
    cy.contains('.btn', 'Logout').click();

    // 23. Assert user is logged out
    // Перевіряємо, що ми повернулися на сторінку вибору користувача
    cy.url().should('include', '/login');
    cy.get('#userSelect').should('be.visible'); // Селект для вибору користувача має бути видимим
    cy.contains('.btn', 'Customer Login').should('be.visible'); // Кнопка Customer Login
  });
});
