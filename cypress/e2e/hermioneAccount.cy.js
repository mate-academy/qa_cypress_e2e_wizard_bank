/* eslint-disable cypress/no-assigning-return-values */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import { faker } from '@faker-js/faker';
/// <reference types='cypress' />

describe('Bank app', () => {
  const depositAmount = `${faker.number.int({ min: 500, max: 1000 })}`;
  const withdrawAmount = `${faker.number.int({ min: 50, max: 500 })}`;

  const user = 'Hermoine Granger';
  const accountNumber = ['1001', '1002', '1003'];
  before(() => {
    cy.visit('/');
    // const currentDate = new Date();
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.title().should('eq', 'XYZ Bank');
    cy.assertPageUrl('#/login');
    cy.contains('.btn', 'Customer Login').click();
    cy.get('select[name="userSelect"]').select(user);
    cy.contains('.btn', 'Login').click();
    cy.assertPageUrl('#/account');
    cy.get('#accountSelect').select(accountNumber[0]);
    cy.contains('[ng-hide="noAccount"]', 'Account Number')
      .contains('strong.ng-binding', accountNumber[0])
      .should('be.visible');

    // cy.get('.borderM > :nth-child(3) > :nth-child(2)')
    cy.get('.borderM .ng-binding').eq(1)
      .invoke('text')
      .then((text) => {
        const startBalance = Number(text.trim());

        cy.contains('[ng-hide="noAccount"]', 'Balance')
          .contains('strong.ng-binding', startBalance)
          .should('be.visible').should('contain', startBalance);
      });

    cy.contains('[ng-hide="noAccount"]', 'Currency').contains('strong.ng-binding', 'Dollar').should('be.visible');
    cy.get('.borderM > :nth-child(3) > :nth-child(2)')
      .invoke('text')
      .then((text) => {
        const beforeDeposit = Number(text.trim());
        cy.log(beforeDeposit);

        cy.get('[ng-click="deposit()"]').click();
        cy.get('[placeholder="amount"]').type(depositAmount);

        cy.contains('[type="submit"]', 'Deposit').click();

        cy.get('.borderM > :nth-child(3) > :nth-child(2)')
          .invoke('text')
          .then((text) => {
            const afterDeposit = Number(text.trim());
            cy.log(afterDeposit);
            expect(afterDeposit - beforeDeposit).to.equal(Number(depositAmount));
          });
      });

    cy.get('[ng-show="message"]').should('contain', 'Deposit Successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance').should('be.visible');

    cy.get('[ng-click="withdrawl()"]').click();
    cy.contains('[type="submit"]', 'Withdraw').should('be.visible');

    cy.get('.borderM > :nth-child(3) > :nth-child(2)')
      .invoke('text')
      .then((text) => {
        const beforeWithdraw = Number(text.trim());
        cy.log(beforeWithdraw);

        cy.get('[placeholder="amount"]').type(withdrawAmount);
        cy.contains('[type="submit"]', 'Withdraw').click();

        cy.get('.borderM > :nth-child(3) > :nth-child(2)')
          .invoke('text')
          .then((text) => {
            const afterWithdraw = Number(text.trim());
            cy.log(afterWithdraw);
            expect(beforeWithdraw - afterWithdraw).to.equal(Number(withdrawAmount));
          });
      });

    cy.get('[ng-show="message"]').should('contain', 'Transaction successful');
    cy.contains('[ng-hide="noAccount"]', 'Balance').should('be.visible');
    cy.get('.borderM > :nth-child(3) > :nth-child(2)').should('be.visible');

    cy.get('[ng-class="btnClass1"]').should('include.text', 'Transactions').click();
    cy.assertPageUrl('#/listTx');

    cy.get('table.table.table-bordered.table-striped').should('be.visible');
    cy.get(':nth-child(1) > a').should('include.text', 'Date-Time');
    // cy.get('thead > tr > :nth-child(1)').click();
    cy.get(':nth-child(2) > a').should('have.text', 'Amount');

    // cy.get('table.table.table-bordered.table-striped tr').should('have.length.greaterThan', 1);
    // cy.get(":nth-child(1) > a").should("include.text", "Date-Time").click();
    cy.get('table.table.table-bordered.table-striped tr')
      .should('have.length.greaterThan', 1)
      .then(($rows) => {
        cy.get('table.table.table-bordered.table-striped')
          .find('tr')
          .eq($rows.length - 1)
          .should('contain', 'Debit')
          .should('contain', withdrawAmount);
        cy.get('table.table.table-bordered.table-striped')
          .find('tr')
          .eq($rows.length - 2)
          .should('contain', 'Credit').should('contain', depositAmount);
      });

    cy.get(':nth-child(3) > a').should('have.text', 'Transaction Type');

    cy.get('.fixedTopBox > [style="float:left"]').click(); // Back button
    cy.assertPageUrl('#/account');

    cy.get('.logout').click();
    cy.assertPageUrl('#/customer');
  });
});
