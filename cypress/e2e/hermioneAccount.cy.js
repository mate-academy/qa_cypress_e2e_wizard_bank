/// <reference types='cypress' />

const firstAccount = '1001';
const secondAccount = '1002';
const depositAmount = 500;
const withdrawAmount = 200;
const accountDetails = '[ng-hide="noAccount"] strong';
const hermioneName = /^Herm(?:ione|oine) Granger$/;

const selectHermione = () => {
  cy.contains('#userSelect option', hermioneName)
    .then(($option) => {
      cy.get('#userSelect').select($option.val());
    });
};

const getBalance = () => {
  return cy.get(accountDetails)
    .eq(1)
    .invoke('text')
    .then((text) => Number(text.trim()));
};

const assertAccount = (number) => {
  cy.get('#accountSelect option:selected')
    .should('contain.text', number);

  cy.get(accountDetails)
    .eq(0)
    .should('contain.text', number);
};

const submitDeposit = () => {
  cy.get('button[ng-click="deposit()"]')
    .should('be.visible')
    .click();

  const input =
    'form[ng-submit="deposit()"] input[placeholder="amount"]';
  const submit =
    'form[ng-submit="deposit()"] button[type="submit"]';

  cy.get(input)
    .should('be.visible')
    .and('be.enabled');

  cy.get(input)
    .clear();

  cy.get(input)
    .type(String(depositAmount));

  cy.get(submit)
    .should('be.visible')
    .and('be.enabled')
    .click();

  cy.get('[ng-show="message"]')
    .should('be.visible')
    .and('contain.text', 'Deposit Successful');
};

const submitWithdrawal = () => {
  cy.get('button[ng-click="withdrawl()"]')
    .should('be.visible')
    .click();

  const input =
    'form[ng-submit="withdrawl()"] input[placeholder="amount"]';
  const submit =
    'form[ng-submit="withdrawl()"] button[type="submit"]';

  cy.get(input)
    .should('be.visible')
    .and('be.enabled');

  cy.get(input)
    .clear();

  cy.get(input)
    .type(String(withdrawAmount));

  cy.get(submit)
    .should('be.visible')
    .and('be.enabled')
    .click();

  cy.get('[ng-show="message"]')
    .should('be.visible')
    .and('contain.text', 'Transaction successful');
};

const openTransactions = () => {
  cy.get('button[ng-click="transactions()"]')
    .should('be.visible')
    .click();

  cy.location('hash', { timeout: 15000 })
    .should('include', '/listTx');

  cy.get('table', { timeout: 15000 })
    .should('be.visible');

  cy.get('table thead')
    .should('contain.text', 'Date-Time')
    .and('contain.text', 'Amount')
    .and('contain.text', 'Transaction Type');
};

const getTransactions = ($table) => {
  const table = $table.get(0);
  const win = table.ownerDocument.defaultView;
  const angular = win.angular;

  if (!angular) {
    return [];
  }

  let scope = angular.element(table).scope();

  while (scope && !Array.isArray(scope.transactions)) {
    scope = scope.$parent;
  }

  return scope ? scope.transactions : [];
};

const hasTransaction = (transactions, amount, type) => {
  return transactions.some((transaction) => {
    const amountMatches = Number(transaction.amount) === amount;
    const typeMatches = transaction.type === type;
    const hasDate = Number.isFinite(Date.parse(transaction.date));

    return hasDate && amountMatches && typeMatches;
  });
};

const assertNewTransactions = () => {
  cy.get('table', { timeout: 15000 })
    .should(($table) => {
      const transactions = getTransactions($table);

      expect(
        transactions.length,
        'transactions in Angular model'
      ).to.be.at.least(2);

      expect(
        hasTransaction(transactions, depositAmount, 'Credit'),
        'deposit transaction'
      ).to.equal(true);

      expect(
        hasTransaction(transactions, withdrawAmount, 'Debit'),
        'withdraw transaction'
      ).to.equal(true);
    });
};

const assertNoTransactions = () => {
  cy.location('hash', { timeout: 15000 })
    .should('include', '/listTx');

  cy.get('table', { timeout: 15000 })
    .should(($table) => {
      const transactions = getTransactions($table);

      expect(
        transactions,
        'transactions for account 1002'
      ).to.have.length(0);
    });

  cy.get('table tbody')
    .find('tr')
    .should('have.length', 0);
};

describe('Wizard Bank - Hermione Granger account', () => {
  beforeEach(() => {
    cy.visit('/#/login');
  });

  it('completes the required Hermione account flow', () => {
    cy.get('button[ng-click="customer()"]')
      .should('be.visible')
      .click();

    cy.get('#userSelect')
      .should('be.visible');

    selectHermione();

    cy.get('button[type="submit"]')
      .should('be.visible')
      .and('be.enabled')
      .click();

    cy.get('#accountSelect')
      .should('be.visible')
      .select(firstAccount);

    assertAccount(firstAccount);

    cy.get(accountDetails)
      .eq(2)
      .should('contain.text', 'Dollar');

    getBalance().then((initialBalance) => {
      expect(Number.isFinite(initialBalance)).to.equal(true);

      submitDeposit();

      getBalance().then((balance) => {
        expect(balance).to.equal(
          initialBalance + depositAmount
        );
      });

      submitWithdrawal();

      getBalance().then((balance) => {
        const expectedBalance =
          initialBalance + depositAmount - withdrawAmount;

        expect(balance).to.equal(expectedBalance);
      });

      openTransactions();
      assertNewTransactions();

      cy.get('button[ng-click="back()"]')
        .should('be.visible')
        .click();

      cy.location('hash', { timeout: 15000 })
        .should('include', '/account');

      cy.get('#accountSelect')
        .should('be.visible')
        .select(secondAccount);

      assertAccount(secondAccount);

      openTransactions();
      assertNoTransactions();

      cy.contains('button', 'Logout')
        .should('be.visible')
        .click();

      cy.location('hash', { timeout: 15000 })
        .should('include', '/customer');

      cy.get('#userSelect')
        .should('be.visible');

      cy.contains('button', 'Logout')
        .should('not.be.visible');
    });
  });
});
