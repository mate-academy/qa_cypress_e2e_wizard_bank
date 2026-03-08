import { faker } from '@faker-js/faker';

describe('Wizard Bank - Hermione Granger Account Tests', () => {
  const depositAmount = faker.number.int({ min: 100, max: 1000 });
  const withdrawAmount = faker.number.int({ min: 10, max: 99 });
  const expectedBalance = depositAmount - withdrawAmount;

  const user = 'Hermione Granger';
  const mainAccount = '1001';
  const secondaryAccount = '1002';

  beforeEach(() => {
    cy.visit(
      'https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login'
    );
  });

  it('should complete the full banking workflow for Hermione Granger', () => {
    cy.contains('button', 'Customer Login').click();
    cy.get('#userSelect').select(user);
    cy.contains('button', 'Login').click();

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', mainAccount)
      .should('be.visible');

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', '0')
      .as('balanceDisplay')
      .should('be.visible');

    cy.contains('.ng-binding', 'Dollar').should('be.visible');

    cy.get('[ng-click="deposit()"]').click();

    cy.get('input[placeholder="amount"]').type(depositAmount.toString());
    cy.get('form').submit();

    cy.get('[ng-show="message"]').should('have.text', 'Deposit Successful');
    cy.get('@balanceDisplay').should('have.text', depositAmount.toString());

    cy.get('[ng-click="withdrawl()"]').click();

    cy.contains('button', 'Withdraw').should('be.visible');
    cy.get('input[placeholder="amount"]').type(withdrawAmount.toString());
    cy.get('form').submit();

    cy.get('[ng-show="message"]').should('have.text', 'Transaction successful');
    cy.get('@balanceDisplay').should('have.text', expectedBalance.toString());

    cy.get('[ng-click="transactions()"]').click();

    cy.get('#anchor0')
      .should('contain', depositAmount)
      .and('contain', 'Credit');
    cy.get('#anchor1')
      .should('contain', withdrawAmount)
      .and('contain', 'Debit');

    cy.contains('button', 'Back').click();
    cy.get('#accountSelect').select(secondaryAccount);
    cy.get('[ng-click="transactions()"]').click();

    cy.get('table tbody tr').should('not.exist');

    cy.contains('button', 'Back').click();
    cy.contains('button', 'Logout').click();

    cy.get('#userSelect').should('be.visible');
  });
});
