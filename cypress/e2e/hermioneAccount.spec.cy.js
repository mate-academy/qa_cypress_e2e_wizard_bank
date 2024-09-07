/// <reference types='cypress' />
import { faker } from '@faker-js/faker';

describe('Bank app', () => {
  const now = new Date(2024, 0, 1).getTime();

  const depositAmount = `${faker.number.int({ min: 500, max: 1000 })}`;
  const withdrawAmount = `${faker.number.int({ min: 50, max: 500 })}`;
  const balance = Number(depositAmount) - Number(withdrawAmount);
  const user = 'Hermoine Granger';
  const accountNumber = '1001';

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.clock(now);

    cy.get(`button[class='btn btn-primary btn-lg']`)
      .contains('Customer Login')
      .click();
    cy.get(`select[name='userSelect']`)
      .select(user);
    cy.get(`button[type='submit']`)
      .click();

    cy.get(`button[ng-click='transactions()']`)
      .click();
    cy.get(`button[ng-click='reset()']`)
      .click();
    cy.get(`button[ng-click='back()']`)
      .click();

    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong', accountNumber)
      .should('be.visible');
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', '0')
      .should('be.visible');
    cy.contains('.ng-binding', 'Dollar')
      .should('be.visible');

    cy.get(`button[ng-click='deposit()']`)
      .click();
    cy.get(`input[ng-model='amount']`)
      .type(depositAmount);
    cy.get(`button[type='submit']`)
      .contains('Deposit')
      .click();
    cy.get(`span[class='error ng-binding']`)
      .contains('Deposit Successful')
      .should('be.visible');

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', depositAmount)
      .should('be.visible');

    cy.get(`button[ng-click='withdrawl()']`)
      .click();
    cy.get(`input[class='form-control ng-pristine ng-untouched ng-invalid ng` +
      `-invalid-required']`)
      .type(withdrawAmount);
    cy.get(`button[type='submit']`)
      .contains('Withdraw')
      .click();
    cy.get(`span[class='error ng-binding']`)
      .contains('Transaction successful')
      .should('be.visible');

    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .contains('strong', balance)
      .should('be.visible');

    cy.get(`button[ng-click='transactions()']`)
      .click();

    cy.get(`table`)
      .within(() => {
        cy.get('td').eq(4).should('contain.text', depositAmount);
        cy.get('td').eq(5).should('contain.text', 'Credit');
        cy.get('td').eq(7).should('contain.text', withdrawAmount);
        cy.get('td').eq(8).should('contain.text', 'Debit');
      });

    cy.get(`button[ng-click='back()']`)
      .click();
    cy.get(`select[name='accountSelect']`)
      .select(1);
    cy.get(`button[ng-click='transactions()']`)
      .click();
    cy.get(`table`)
      .within(() => {
        cy.get('td').eq(4).should('not.exist');
        cy.get('td').eq(5).should('not.exist');
      });
    cy.get(`button[ng-click='byebye()']`)
      .click();
    cy.get(`select[name='userSelect']`)
      .should('be.visible');
  });
});
