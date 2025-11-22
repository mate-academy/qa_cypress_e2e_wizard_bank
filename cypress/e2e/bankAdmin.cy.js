const { faker } = require('@faker-js/faker');
const BankAdminObject = require('../support/BankAdmin.Object');
const countUsers = require('../support/functions');

const bankAdmin = new BankAdminObject();

describe('Bank Admin', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const postCode = `${faker.number.int({ min: 10, max: 90 })}-${faker.number.int({ min: 100, max: 999 })}`;

  it('should provide ability to add, open account and delete user', () => {
    bankAdmin.clickAdminPanelBtn();
    bankAdmin.clickAddCustomerBtn();
    bankAdmin.typeUserData('First Name', firstName);
    bankAdmin.typeUserData('Last Name', lastName);
    bankAdmin.typeUserData('Post Code', postCode);
    bankAdmin.clickSubmitBtn();
    bankAdmin.clickShowCustomerBtn();
    countUsers();
    cy.get('@users').then((usersCount) => {
      bankAdmin.assertCreatedUserAndOpenAccountForUser(
        firstName, lastName, postCode, usersCount, false);
    });

    bankAdmin.clickOpenAccountBtn();
    bankAdmin.selectUser(`${firstName} ${lastName}`);
    bankAdmin.selectCurrency('Dollar');
    bankAdmin.clickSubmitBtn();
    bankAdmin.clickShowCustomerBtn();
    cy.get('@users').then((usersCount) => {
      bankAdmin
        .assertCreatedUserAndOpenAccountForUser(
          firstName, lastName, postCode, usersCount, true);
    });

    bankAdmin.clickDeleteUser();
    cy.get('@users').then((usersCount) => {
      bankAdmin.assertDeletedUser(firstName, lastName, postCode, usersCount);
    });
  });
});
