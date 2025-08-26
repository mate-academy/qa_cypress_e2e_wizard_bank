/// <reference types="cypress" />

describe('Bank app', function () {
  const deposit = 500;
  const withdraw = 200;

  before(function () {
    cy.visit('/');
  });

  it('should provide the ability to work with Hermiones bank account', () => {
    cy.contains('button', 'Customer Login', { matchCase: false }).click();

    cy.get('#userSelect, [name="userSelect"]').should('be.visible');
    cy.get('#userSelect, [name="userSelect"]').select('Hermione Granger');

    cy.contains('button', 'Login', { matchCase: false }).click();

    cy.contains(/Welcome\s+Hermione Granger/i).should('be.visible');

    cy.contains('[ng-hide="noAccount"]', 'Account Number', { matchCase: false })
      .find('strong')
      .invoke('text')
      .then(function (t) {
        expect(t.trim()).to.match(/^\d+$/);
      });

    cy.contains('[ng-hide="noAccount"]', 'Balance', { matchCase: false })
      .find('strong')
      .should('have.text', '0');

    cy.contains('.ng-binding', 'Dollar', { matchCase: false })
      .should('be.visible');

    cy.contains('button', 'Deposit', { matchCase: false }).click();

    cy.get('input[placeholder="amount"], input[type="number"]').first().clear();
    cy.get('input[placeholder="amount"], input[type="number"]').first()
      .type(String(deposit));

    cy.contains('[type="submit"], button', /^Deposit$/i).click();

    cy.get('[ng-show="message"]').should('contain.text', 'Deposit Successful');

    cy.contains('[ng-hide="noAccount"]', 'Balance', { matchCase: false })
      .find('strong')
      .should('have.text', String(deposit));

    cy.contains('button', /Withdrawl/i).click();

    cy.get('input[placeholder="amount"], input[type="number"]').first().clear();
    cy.get('input[placeholder="amount"], input[type="number"]')
      .first().type(String(withdraw));

    cy.contains('[type="submit"], button', /^Withdraw$/i).click();

    cy.get('[ng-show="message"]')
      .should('contain.text', 'Transaction successful');

    cy.contains('[ng-hide="noAccount"]', 'Balance', { matchCase: false })
      .find('strong')
      .should('have.text', String(deposit - withdraw));

    cy.contains('button', 'Transactions', { matchCase: false }).click();

    cy.get('table tbody tr').should('have.length.at.least', 2);

    cy.get('table tbody').then(function ($tbody) {
      const text = $tbody.text().toLowerCase();
      expect(text).to.include(String(deposit));
      expect(text).to.match(/credit|deposit/);
      expect(text).to.include(String(withdraw));
      expect(text).to.match(/debit|withdraw/);
    });

    cy.contains('button', /^Back$/i).click();

    cy.get('select#accountSelect, select[name="accountSelect"], select')
      .filter(function (i, el) {
        return el && el.options && el.options.length > 1;
      })
      .first()
      .select(1);

    cy.contains('button', 'Transactions', { matchCase: false }).click();

    cy.get('table tbody').then(function ($tb) {
      const rows = $tb.find('tr');
      if (rows.length === 0) {
        expect(rows.length).to.eq(0);
      } else {
        cy.contains(/No Transactions Found/i).should('be.visible');
      }
    });

    cy.contains('button', /^Back$/i).click();

    cy.contains('button', /^Logout$/i).click();

    cy.contains('button', 'Customer Login', { matchCase: false })
      .should('be.visible');
    cy.contains('button', 'Bank Manager Login', { matchCase: false })
      .should('be.visible');
  });
});
