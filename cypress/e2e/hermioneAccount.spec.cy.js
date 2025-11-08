import { faker } from '@faker-js/faker';
/// <reference types='cypress' />

describe('Bank app', () => {
  const user = 'Hermoine Granger';
  const depositAmount = faker.number.int({ min: 5000, max: 30000 });
  const withdrawAmount = faker.number.int({ min: 50, max: 4500 });
  let balance;
  let currency;

  before(() => {
    cy.visit('https://www.globalsqa.com/' +
      'angularJs-protractor/BankingProject/#/login');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.contains('.btn', 'Customer Login').click();

    cy.get('#userSelect').select(user);
    cy.contains('.btn', 'Login').click();

    cy.url().should('contain', '/account');

    cy.get('strong').should('contain', user);

    cy.get('.center').should('contain', 'Account Number : 1001');

    cy.contains('.center', 'Balance :')
      .find('strong').eq(1).invoke('text').then((text) => {
        balance = parseFloat(text.trim());
      });

    cy.contains('.center', 'Currency :')
      .find('strong').eq(2).invoke('text').then((text) => {
        currency = text.trim();
        expect(currency).to.contain('Dollar');
      });

    cy.contains('.btn', 'Deposit').click();

    cy.get('input[placeholder="amount"]').type(depositAmount);
    cy.contains('[type="submit"]', 'Deposit').click();

    cy.get('span[ng-show="message"]').should('contain', 'Deposit Successful');

    cy.contains('.center', 'Balance :')
      .find('strong').eq(1).invoke('text').then((newBalanceTxt) => {
        const newBalance = parseFloat(newBalanceTxt);
        expect(newBalance).to.equal(balance + depositAmount);
        balance = newBalance;
      });

    cy.contains('.btn', 'Withdrawl').click();

    cy.get('input[placeholder="amount"]').clear();
    cy.get('input[placeholder="amount"]').type(withdrawAmount);
    cy.get('input[placeholder="amount"]')
      .should('have.value', withdrawAmount.toString());

    cy.contains('[type="submit"]', 'Withdraw').click();

    cy.get('span[ng-show="message"]')
      .should('contain', 'Transaction successful');
    cy.get('span[ng-show]').invoke('text').then((msg) => {
      cy.log(`Message: ${msg}`);
    });

    cy.contains('.center', 'Balance :')
      .find('strong').eq(1).invoke('text').then((newBalanceTxt) => {
        const finishBalance = parseFloat(newBalanceTxt);
        expect(finishBalance).to.equal(balance - withdrawAmount);
      });

    cy.contains('.btn', 'Transactions').click();

    const today = new Date().toISOString().slice(0, 10);
    cy.get('#start').invoke('val', `${today}T00:00`).trigger('change');

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5000); // Workaround because of unstable calendar filter

    cy.get('tbody tr', { timeout: 10000 }).should('have.length.at.least', 1);

    cy.contains('tr', depositAmount).should('contain', 'Credit');
    cy.contains('tr', withdrawAmount).should('contain', 'Debit');

    cy.contains('tr', depositAmount)
      .should('contain', 'Credit');
    cy.contains('tr', withdrawAmount)
      .should('contain', 'Debit');

    cy.contains('.btn', 'Back').click();

    cy.get('select#accountSelect').select('1002');
    cy.contains('.btn', 'Transactions').click();
    cy.get('tbody tr').should('have.length', 0);

    cy.contains('.btn', 'Logout').click();
    cy.get('#userSelect option:selected').should('contain', 'Your Name');
  });
});
