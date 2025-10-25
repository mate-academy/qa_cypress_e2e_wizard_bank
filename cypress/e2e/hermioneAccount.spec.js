/// <reference types='cypress' />

describe('Bank app', () => {
  before(() => {
    // używamy pełnego URL, żeby test działał niezależnie od baseUrl
    cy.visit('https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login');
  });

  it("should provide the ability to work with Hermione's bank account", () => {
    // Kliknij Customer Login
    cy.contains('Customer Login').click();

    // Wybierz Hermione Granger i zaloguj się
    cy.get('select').select('Hermione Granger');
    cy.contains('Login').click();

    // Sprawdź numer konta, saldo i walutę (saldo jest drugim .ng-binding)
    cy.get('.ng-binding').contains('1001').should('be.visible');
    cy.get('.ng-binding').eq(1).should('contain', '0'); // saldo
    cy.get('.ng-binding').contains('Dollar').should('be.visible');

    // Wpłata 100
    cy.contains('Deposit').click(); // przełącz na zakładkę Deposit
    cy.get('input[placeholder="amount"]').clear().type('100');
    // klikamy submit formularza (precyzyjny selector zamiast cy.contains)
    cy.get('form').submit();

    cy.contains('Deposit Successful').should('be.visible');
    cy.get('.ng-binding').eq(1).should('contain', '100');

    // Wypłata 50
    cy.contains('Withdrawl').click(); // przełącz na zakładkę Withdrawl
    cy.get('input[placeholder="amount"]').clear().type('50');
    // submit formularza również tutaj
    cy.get('form').submit();

    cy.contains('Transaction successful').should('be.visible');
    cy.get('.ng-binding').eq(1).should('contain', '50');

    // Sprawdź transakcje (najnowsze na górze)
    cy.contains('Transactions').click();
    // teraz najnowsza (Withdrawal 50) powinna być first(), Deposit 100 ostatnia
    cy.get('table tbody tr').should('have.length', 2);
    cy.get('table tbody tr').first().should('contain', 'Withdrawal').and('contain', '50');
    cy.get('table tbody tr').last().should('contain', 'Deposit').and('contain', '100');

    // Cofnij
    cy.contains('Back').click();

    // Zmień konto i sprawdź, że nie ma transakcji
    cy.get('#accountSelect').select('1002');
    cy.contains('Transactions').click();
    cy.get('table tbody tr').should('not.exist');

    // Wyloguj
    cy.contains('Back').click();
    cy.contains('Logout').click();

    // Sprawdź, że użytkownik jest wylogowany
    cy.contains('Your Name :').should('be.visible');
  });
});
