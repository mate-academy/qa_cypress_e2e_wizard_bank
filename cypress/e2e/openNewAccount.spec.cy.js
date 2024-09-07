/// <reference types='cypress' />

describe('Manager Login', () => {
  const now = new Date(2024, 0, 1).getTime();

  const fName = 'Jhon';
  const lName = 'Doe';
  const pCode = '12345';
  const cId = '6';
  const aNumber = '1016';
  const aCurrecny = 'Dollar';
  const aBalance = '0';

  before(() => {
    cy.visit('/');
  });

  it('should provide the ability to open new account`s', () => {
    cy.clock(now);
    const alertShown = cy.stub().as('alertShown');
    cy.on('window:alert', alertShown);

    cy.get(`button[ng-click='manager()']`)
      .click();

    cy.get(`button[ng-click='addCust()']`)
      .click();

    cy.get(`input[ng-model='fName']`)
      .type(fName);
    cy.get(`input[ng-model='lName']`)
      .type(lName);
    cy.get(`input[ng-model='postCd']`)
      .type(pCode);
    cy.get(`button[type='submit']`)
      .click();
    cy.get('@alertShown')
      .should('have.been.calledWith', 'Customer added successfully with cu' +
            `stomer id :${cId}`);

    cy.get(`button[ng-click='openAccount()']`)
      .click();
    cy.get(`select[name='userSelect']`)
      .select(fName + ' ' + lName);
    cy.get(`select[name='currency']`)
      .select(aCurrecny);
    cy.get(`button[type='submit']`)
      .click();
    cy.get('@alertShown')
      .should('have.been.calledWith', 'Account created successfully with a' +
          `ccount Number :${aNumber}`);

    cy.get(`button[ng-click='showCust()']`)
      .click();
    cy.get(`input[ng-model='searchCustomer']`)
      .type(fName);
    cy.get(`table`)
      .within(() => {
        cy.get('td').eq(5).should('contain.text', fName);
        cy.get('td').eq(6).should('contain.text', lName);
        cy.get('td').eq(7).should('contain.text', pCode);
        cy.get('td').eq(8).should('contain.text', aNumber);
      });

    cy.get(`button[ng-click='home()']`)
      .click();
    cy.get(`button[class='btn btn-primary btn-lg']`)
      .contains('Customer Login')
      .click();
    cy.get(`select[name='userSelect']`)
      .select(fName + ' ' + lName);
    cy.get(`button[type='submit']`)
      .click();
    cy.contains('[ng-hide="noAccount"]', 'Balance')
      .should('have.text', `Account Number : ${aNumber} , \n\tBalance : ${aBalance} , ` +
        `\n\ttCurrency : ${aCurrecny}`);

    cy.get(`button[ng-click='byebye()']`)
      .click();
    cy.get(`select[name='userSelect']`)
      .should('be.visible');
  });
});
