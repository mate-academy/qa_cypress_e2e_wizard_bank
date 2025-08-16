/// <reference types='cypress' />

const person = {
  firstName: 'Hermoine',
  lastName: 'Granger',
  accountNum: 1001,
  balance: 5096,
  currency: 'Dollar',
  deposit: 2000,
  withdrawAmount: 5000
};

describe('Bank app', () => {
  before(() => {
    cy.visit(
      'https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login'
    );
  });

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.get('button').contains('Customer Login').click();

    cy.get('#userSelect').select(`${person.firstName} ${person.lastName}`);
    cy.get('button').contains('Login').click();

    cy.get('strong').contains(person.accountNum);
    cy.get('strong').contains(person.balance);
    cy.get('strong').contains(person.currency);

    cy.get('button').contains('Deposit ').click();
    cy.get('label').contains('Amount to be Deposited :')
      .siblings('input').type(person.deposit);
    cy.get('[type=submit]').contains('Deposit').click();
    cy.get('span').contains('Deposit Successful').should('be.visible');
    cy.get('strong').contains(person.balance + person.deposit);

    cy.get('button').contains('Withdrawl ').click();
    cy.get('label').contains('Amount to be Withdrawn :')
      .siblings('input').type(person.withdrawAmount);
    cy.get('[type=submit]').contains('Withdraw').click();
    cy.get('span').contains('Transaction successful').should('be.visible');
    cy.get('strong').contains(person.balance - person.withdrawAmount);

    cy.reload();
    cy.get('button').contains('Transactions ').click();

    cy.get('td').contains(person.deposit).next().contains('Credit');
    cy.get('td').contains(person.withdrawAmount).next().contains('Debit');
    cy.get('button').contains('Back').click();

    cy.get('#accountSelect').select('1002');
    cy.get('button').contains('Transactions ').click();
    cy.get('table tbody').find('td').should('not.exist');

    cy.get('button').contains('Logout').click();
    cy.get('label').contains('Your Name :');
  });
});
