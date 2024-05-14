/// <reference types='cypress' />

describe('Bank app', () => {
  const user = 'Hermoine Granger';
  const accountNumber = '1001';
  let balance;
  let expectedBalance;
  let ballanceAfterWithdrawl;
  const currency = 'Dollar';
  const depositeAmount = 10000;
  const withdrawlAmount = 10;
  const formattedDateTime = `2024-01-01T20:00`;

  const customerLoginBtn = 'Customer Login';
  const depositBtn = 'Deposit';
  const withdrawlBtn = 'Withdrawl';
  const transactionBtn = 'Transaction';
  const resetBtn = 'Reset';
  const backBtn = 'Back';

  const depositSuccessMessage = 'Deposit Successful';
  const withdrawlSuccessMessage = 'Transaction successful';

  beforeEach(() => {
    cy.visit('/');
    cy.contains('.btn', customerLoginBtn).click();
    cy.get('#userSelect').select(user);
    cy.get('[type = "submit"').click();
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.url().should('contain', 'customer');
    cy.get('.fontBig').should('contain', user);
    cy.get('#accountSelect').should('contain', accountNumber);
    cy.get('.borderM > :nth-child(3) > :nth-child(3)')
      .should('contain', currency);

    cy.contains('.btn', transactionBtn).click();
    cy.contains('.btn', resetBtn).click();
    cy.contains('.btn', backBtn).click();

    cy.get('.borderM > :nth-child(3) > :nth-child(2)')
      .invoke('text')
      .then((text) => {
        balance = text;
        cy.contains('.btn', depositBtn).click();
        cy.get('.form-control').type(depositeAmount);
        cy.get('[type = "submit"').click();
        cy.contains('.error', depositSuccessMessage).should('be.visible');

        expectedBalance = (+balance + depositeAmount).toString();
        cy.get('.borderM > :nth-child(3) > :nth-child(2)')
          .should('have.text', expectedBalance);

        cy.contains('.btn', transactionBtn).click();
        cy.contains('.btn', backBtn).click();
        cy.contains('.btn', transactionBtn).click();

        cy.get('#start').type(formattedDateTime);

        cy.get('#anchor0 > :nth-child(2)')
          .should('contain', depositeAmount);
        cy.get('#anchor0 > :nth-child(3)')
          .should('contain', 'Credit');

        cy.contains('.btn', backBtn).click();
        cy.get('#accountSelect').type('{downarrow}{enter}');
        cy.get('#accountSelect').should('contain', '1002');
        cy.contains('.btn', transactionBtn).click();
        cy.get('.transaction-list').should('not.exist');

        cy.get('.logout').click();
        cy.url().should('contain', 'customer');
      });
  });

  it('should provide the ability to withdrawl with Hermione\'s bank account',
    () => {
      cy.get('.borderM > :nth-child(3) > :nth-child(2)')
        .invoke('text')
        .then((text) => {
          balance = text;

          cy.contains('.btn', withdrawlBtn).click();
          cy.get('.form-control').type(withdrawlAmount);
          cy.get('[type = "submit"').click();
          cy.contains('.error', withdrawlSuccessMessage).should('be.visible');

          ballanceAfterWithdrawl = (+balance - withdrawlAmount)
            .toString();
          cy.get('.borderM > :nth-child(3) > :nth-child(2)')
            .should('have.text', ballanceAfterWithdrawl);

          cy.contains('.btn', transactionBtn).click();
          cy.contains('.btn', backBtn).click();
          cy.contains('.btn', transactionBtn).click();

          cy.reload();
          cy.get('#start').type(formattedDateTime);

          cy.get('#anchor0 > :nth-child(2)')
            .should('contain', withdrawlAmount);
          cy.get('#anchor0 > :nth-child(3)')
            .should('contain', 'Debit');
          cy.contains('.btn', resetBtn).click();

          cy.contains('.btn', backBtn).click();
          cy.get('#accountSelect').type('{downarrow}{enter}');
          cy.get('#accountSelect').should('contain', '1002');
          cy.contains('.btn', transactionBtn).click();
          cy.get('.transaction-list').should('not.exist');

          cy.get('.logout').click();
          cy.url().should('contain', 'customer');
        });
    });
});
