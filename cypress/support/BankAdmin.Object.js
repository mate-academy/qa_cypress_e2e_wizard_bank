class BankAdminObject {
  clickAdminPanelBtn() {
    cy.contains('.btn', 'Bank Manager Login')
      .click();
  }

  typeUserData(placeholder, name) {
    cy.get(`[placeholder="${placeholder}"]`)
      .type(name);
  }

  clickAddCustomerBtn() {
    cy.get('[ng-click="addCust()"]')
      .click();
  }

  clickShowCustomerBtn() {
    cy.get('[ng-click="showCust()"]')
      .click();
  }

  clickSubmitBtn() {
    cy.get(`[type="submit"]`)
      .click();
  }

  clickDeleteUser() {
    cy.get('[ng-click="deleteCust(cust)"]')
      .last()
      .click();
  }

  clickOpenAccountBtn() {
    cy.get('[ng-click="openAccount()"]')
      .click();
  }

  selectUser(user) {
    cy.get('[ng-model="custId"]')
      .select(user);
  }

  selectCurrency(currency) {
    cy.get('[ng-model="currency"]')
      .select(currency);
  }

  assertCreatedUserAndOpenAccountForUser(
    firstName, lastName, postCode, usersCount, isAccount) {
    cy.get(`tbody > :nth-child(${usersCount}) > :nth-child(1)`)
      .should('have.text', firstName);
    cy.get(`tbody > :nth-child(${usersCount}) > :nth-child(2)`)
      .should('have.text', lastName);
    cy.get(`tbody > :nth-child(${usersCount}) > :nth-child(3)`)
      .should('have.text', postCode);
    if (isAccount) {
      cy.get(`tbody > :nth-child(${usersCount}) > :nth-child(4)`)
        .should('contain', String(1010 + usersCount));
    }
  }

  assertDeletedUser(firstName, lastName, postCode, usersCount) {
    cy.get('.ng-binding')
      .should('not.contain', firstName);
    cy.get('.ng-binding')
      .should('not.contain', lastName);
    cy.get('.ng-binding')
      .should('not.contain', postCode);
    cy.get('.ng-binding')
      .should('not.have.text', String(1010 + usersCount + 1));
  }
}

module.exports = BankAdminObject;
