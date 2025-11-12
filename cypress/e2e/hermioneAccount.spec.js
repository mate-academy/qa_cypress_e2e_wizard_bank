/* eslint-disable max-len */
describe('Волшебный банк — проверка потока клиента Гермиона Грейнджер', () => {
  beforeEach(() => {
    // Переходим на страницу тестового приложения
    cy.visit('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login');
  });

  it('Проверка депозита, вывода и транзакций для Гермионы Грейнджер', () => {
    // Вход клиента
    cy.contains('Customer Login').click();

    // Выбираем Гермиону Грейнджер
    cy.get('#userSelect').select('Hermoine Granger');
    cy.contains('Login').click();

    // Подтверждаем номер счёта и валюту
    cy.get('.form-control').should('exist').then(($select) => {
      const accountNumber = $select.val();
      expect(accountNumber).to.equal('1001'); // Гермиона Грейнджер имеет счёт №1001
    });

    cy.get('.center strong:nth-child(1)').should('contain', 'Account Number');
    cy.get('.center strong:nth-child(2)').should('contain', 'Balance : 0');
    cy.get('.center strong:nth-child(3)').should('contain', 'Currency : Pound');

    // Сохраняем начальный баланс
    cy.get('.center strong:nth-child(2)').invoke('text').then((balanceText) => {
      const startBalance = parseFloat(balanceText.replace(/[^\d.-]/g, ''));

      // === ДЕПОЗИТ ===
      cy.contains('Deposit').click();
      cy.get('input[placeholder="amount"]').type('100');
      cy.contains('Deposit').click();
      cy.get('.error').should('contain', 'Deposit Successful');

      // Проверяем, что баланс увеличился
      cy.get('.center strong:nth-child(2)').invoke('text').then((afterDepositText) => {
        const afterDeposit = parseFloat(afterDepositText.replace(/[^\d.-]/g, ''));
        expect(afterDeposit).to.equal(startBalance + 100);
      });

      // === ВЫВОД ===
      cy.contains('Withdrawl').click();
      cy.get('input[placeholder="amount"]').type('50');
      cy.contains('Withdraw').click();
      cy.get('.error').should('contain', 'Transaction successful');

      // Проверяем, что баланс уменьшился
      cy.get('.center strong:nth-child(2)').invoke('text').then((afterWithdrawText) => {
        const afterWithdraw = parseFloat(afterWithdrawText.replace(/[^\d.-]/g, ''));
        expect(afterWithdraw).to.equal(startBalance + 50);
      });

      // === ТРАНЗАКЦИИ ===
      cy.contains('Transactions').click();
      cy.get('table tbody tr').should('have.length', 2);
      cy.get('table tbody tr').first().should('contain', 'Debit').and('contain', '50');
      cy.get('table tbody tr').last().should('contain', 'Credit').and('contain', '100');

      cy.contains('Back').click();

      // === СМЕНА СЧЁТА ===
      cy.get('#accountSelect').select('1002');
      cy.contains('Transactions').click();
      cy.get('table tbody tr').should('have.length', 0);
      cy.contains('Back').click();

      // === ВЫХОД ===
      cy.contains('Logout').click();
      cy.url().should('include', 'login');
      cy.contains('Your Name :').should('be.visible');
    });
  });
});
