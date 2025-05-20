/// <reference types='cypress' />

describe('Bank app', () => {
  before(() => {
    cy.visit('/');
  });

  let currentBalance = '';

  it('should provide the ability to work with Hermione\'s bank account', () => {
    cy.get('.borderM > :nth-child(1) > .btn').click();
    cy.get('#userSelect').select('1');
    cy.get('form.ng-valid > .btn').click();

    cy.get('.borderM > :nth-child(1) > strong')
      .should('exist')
      .should('contain.text', 'Hermoine Granger ');

    cy.get('.borderM > :nth-child(3)').should('exist');

    cy.get('.borderM > :nth-child(3) > :nth-child(2)')
      .invoke('text')
      .then((text) => (currentBalance = text));

    cy.get('[ng-class="btnClass2"]').click();

    cy.get('.form-control').type('500');

    cy.get('form.ng-dirty > .btn').click();

    cy.get('.borderM > :nth-child(3) > :nth-child(2)')
      .invoke('text')
      .then((updatedText) => {
        const updatedBalance = Number(updatedText);
        expect(updatedBalance).to.equal(Number(currentBalance) + 500);

        currentBalance = Number(currentBalance) + 500;
      });

    cy.get('.error').should('exist');

    cy.get('[ng-class="btnClass3"]').click();

    cy.get('.form-control').type('500');

    cy.get('form.ng-dirty > .btn').click();

    cy.get('.borderM > :nth-child(3) > :nth-child(2)')
      .invoke('text')
      .then((updatedText) => {
        const updatedBalance = Number(updatedText);
        expect(updatedBalance).to.equal(Number(currentBalance) - 500);

        currentBalance = Number(currentBalance) - 500;
      });

    cy.get('.error').should('exist');

    cy.get('[ng-class="btnClass1"]').click();

    cy.get('.fixedTopBox > [style="float:left"]').click(); // close

    cy.get('[ng-class="btnClass2"]').click();

    cy.get('.form-control').type('500');

    cy.get('form.ng-dirty > .btn').click();

    cy.get('[ng-class="btnClass1"]').click();

    cy.get('#anchor0 > :nth-child(2)')
      .should('exist')
      .should('contain.text', '500');
    cy.get('#anchor1 > :nth-child(2)')
      .should('exist')
      .should('contain.text', '500');

    cy.get('.fixedTopBox > [style="float:left"]').click();

    cy.get('#accountSelect').select('1002');

    cy.get('[ng-class="btnClass1"]').click();

    cy.get('.logout').click(); // logout

    cy.url().should(
      'equal',
      'https://www.globalsqa.com/angularJs-protractor/BankingProject/#/customer'
    );
  });
});
