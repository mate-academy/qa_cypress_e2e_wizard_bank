/// <reference types='cypress' />

describe('Bank app', () => {
  const users = [
    'Hermione Granger',
    'Harry Potter',
    'Ron Weasly',
    'Albus Dumbledore',
    'Neville Longbottem'
  ];
  const depositAmount = 15000;
  const withdrawAmount = 500;

  let selectedUser;

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to work with bank account', () => {
    selectedUser = users[Math.floor(Math.random(4) * users.length)];
    cy.log('Selected user: ' + selectedUser);
    cy.contains('.btn', 'Customer Login').click();
    cy.get('[name="userSelect"]').select(selectedUser);
    cy.contains('.btn', 'Login').click();

    cy.get('[ng-class="btnClass2"]').click();
    cy.get('.form-control').type(depositAmount);
    cy.get('form.ng-dirty > .btn').click();

    cy.get('[ng-class="btnClass3"]').click();
    cy.get('form.ng-pristine > .btn').click();
    cy.get('.form-control').type(withdrawAmount);
    cy.get('form.ng-dirty > .btn').click();

    cy.get('[ng-class="btnClass1"]').click();
    cy.get('.fixedTopBox > [style="float:left"]').click();

    cy.get('#accountSelect').select(+1);

    cy.get('[ng-class="btnClass1"]').click();

    cy.get('.logout').click();
  });
});
