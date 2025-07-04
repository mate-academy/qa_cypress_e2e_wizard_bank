export default class HeaderObject {
  title = 'XYZ Bank';

  clickHomeButton() {
    return cy.get('button[ng-click="home()"]').contains('Home').click();
  }

  clickLogoutButton() {
    return cy.get('button[ng-show="logout"]').contains('Logout').click();
  }

  verifyTitle() {
    return cy.get('.mainHeading').should('contain', this.title);
  }
}
