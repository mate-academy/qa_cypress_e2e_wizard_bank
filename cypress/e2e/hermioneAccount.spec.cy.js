import { faker } from '@faker-js/faker';
/// <reference types='cypress' />

describe('Bank app', () => {
  const depositAmount = `${faker.number.int({ min: 500, max: 1000 })}`;
  const withdrawAmount = `${faker.number.int({ min: 50, max: 500 })}`;
  const user = 'Hermoine Granger';
  const accountNumber = '1001';
  const initialBalance = 0;
  const balance = initialBalance + (depositAmount - withdrawAmount);

  before(() => {
    cy.visit('/');
  });

  it(`should provide the ability to work with Hermione's bank account`, () => {
    cy.contains('.btn', 'Customer Login').click();
    cy.get('[name="userSelect"]').select(user);
    cy.contains('.btn', 'Login').click();

    cy.findByNgClick('transactions').click();
    cy.findByNgClick('reset').click();
    cy.findByNgClick('back').click();

    cy.findByNgHide('noAccount', 'Account Number', accountNumber).should(
      'be.visible'
    );
    cy.findByNgHide('noAccount', 'Balance', '0').should('be.visible');

    cy.findByNgClick('deposit').click();
    cy.findByPlaceholder('amount').type(depositAmount);
    cy.contains('[type="submit"]', 'Deposit').click();

    cy.findByNgShow('message').should('contain', 'Deposit Successful');

    cy.findByNgHide('noAccount', 'Balance', depositAmount).should('be.visible');

    cy.findByNgClick('withdrawl').click();
    cy.contains('[type="submit"]', 'Withdraw').should('be.visible');
    cy.findByPlaceholder('amount').type(withdrawAmount);
    cy.contains('[type="submit"]', 'Withdraw').click();

    cy.findByNgShow('message').should('contain', 'Transaction successful');
    cy.findByNgHide('noAccount', 'Balance', balance).should('be.visible');

    cy.findByNgClick('transactions').click();
    cy.then(() => {
      cy.reload();
    });

    cy.contains('.ng-scope', depositAmount).should('be.visible');
    cy.contains('.ng-scope', withdrawAmount).should('be.visible');
    cy.findByNgClick('back').click();

    cy.get('[name="accountSelect"]').select('1002');
    cy.findByNgClick('transactions').click();
    cy.get('tbody').children().should('have.length', 0);
    cy.findByNgClick('byebye').click();
    cy.get('[name="userSelect"]').should('be.visible');
  });
});
