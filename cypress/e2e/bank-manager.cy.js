/// <reference types='cypress' />

import { faker } from '@faker-js/faker';

describe('Bank manager', () => {
  const newUser = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    postCode: faker.number.int({ min: 10000, max: 99999 }),
    currency: 'Dollar'
  };

  before(() => {
    cy.visit('/');
  });

  it('should provide an ability to work as bank manager', () => {
    cy.contains('button', 'Home').click();
    cy.contains('button', 'Customer Login').should('exist');
    cy.contains('button', 'Bank Manager Login').click();

    cy.contains('button', 'Add Customer').click();
    cy.get('input[ng-model="fName"]').type(newUser.firstName);
    cy.get('input[ng-model="lName"]').type(newUser.lastName);

    cy.window().then(() => {
      cy.on('window:alert', (alertText) => {
        expect(alertText).to.include('successfully');
      });
    });
    cy.get('input[ng-model="postCd"]').type(newUser.postCode + '{enter}');

    cy.contains('button', 'Open Account').click();
    cy.get('select#userSelect')
      .select(newUser.firstName + ' ' + newUser.lastName);
    cy.get('select#currency').select(newUser.currency);

    cy.window().then(() => {
      cy.on('window:alert', (alertText) => {
        expect(alertText).to.include('successfully');
      });
    });
    cy.contains('button', 'Process').click();

    cy.contains('button', 'Customers').click();
    cy.contains('td', newUser.postCode).should('exist');
    cy.contains('td', newUser.postCode)
      .parent('tr')
      .within(() => {
        cy.contains('button', 'Delete').click();
      });

    cy.contains('td', newUser.postCode).should('not.exist');
  });
});
