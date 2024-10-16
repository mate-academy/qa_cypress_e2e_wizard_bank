/// <reference types='cypress' />
describe('Bank app', () => {
  const name = 'Hermione Granger';
  const number = '1001';
  const anotherNumber = '1002';
  let balance;
  const currency = 'Dollar';
  const deposit = '1000';
  const withdrawl = '35';
  const depositSuccess = 'Deposit Successful';
  const withdrawlSuccess = 'Transaction successful';

  // Додавання правильного URL для cy.visit
  before(() => {
    cy.visit(
      'https://globalsqa.com/angularJs-protractor/BankingProject/#/login');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
  // Логін
    cy.contains('.btn', 'Customer Login').click();
    cy.get('#userSelect').select(name);
    cy.get('[type="submit"]').click();

    // Перевірка номера аккаунту
    cy.get('#accountSelect').should('contain', number);

    // Перевірка транзакцій
    cy.contains('.btn', 'Transactions ').click();
    cy.contains('.btn', 'Reset').click();
    cy.contains('.btn', 'Back').click();

    // Отримання балансу перед депозитом
    cy.get('.borderM > :nth-child(3) > :nth-child(2)')
      .invoke('text')
      .then((text) => {
        balance = text;

        // Обчислення балансу після депозиту та зняття
        const balanceAfterDeposit = (+balance + +deposit).toFixed(2);
        const balanceAfterWith = (+balanceAfterDeposit - +withdrawl).toFixed(2);

        // Перевірка валюти
        cy.contains('.ng-binding', currency).should('be.visible');

        // Депозит
        cy.contains('.btn', 'Deposit ').click();
        cy.get('[placeholder="amount"]').type(deposit);
        cy.get('[type="submit"]').click();
        cy.get('.error').should('contain', depositSuccess);
        cy.get('.borderM > :nth-child(3) > :nth-child(2)')
          .should('contain', balanceAfterDeposit);

        // Перевірка транзакцій після депозиту
        cy.contains('.btn', 'Transactions ').click();
        cy.contains('.btn', 'Back').click();

        // Зняття коштів
        cy.contains('.btn', 'Withdrawl ').click();
        cy.get('[placeholder="amount"]').type(withdrawl);
        cy.get('[type="submit"]').click();
        cy.get('.error').should('contain', withdrawlSuccess);
        cy.get('.borderM > :nth-child(3) > :nth-child(2)')
          .should('contain', balanceAfterWith);

        // Перевірка історії транзакцій
        cy.reload();
        cy.contains('.btn', 'Transactions ').click();
        cy.contains('tr', 'Credit').should('contain', deposit);
        cy.contains('tr', 'Debit').should('contain', withdrawl);
        cy.contains('.btn', 'Back').click();

        // Перемикання на інший акаунт і перевірка, що немає транзакцій
        cy.get('#accountSelect').select(anotherNumber);
        cy.contains('.btn', 'Transactions ').click();
        cy.contains('tr', 'Credit').should('not.exist');
        cy.contains('tr', 'Debit').should('not.exist');

        // Логаут
        cy.get('.logout').click();
        cy.get('#userSelect').should('exist');
      });
  });
});
