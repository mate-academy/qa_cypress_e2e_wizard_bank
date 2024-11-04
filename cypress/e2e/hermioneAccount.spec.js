/* eslint-disable */
/// <reference types='cypress' />

describe('Bank app', () => {
  const userName = 'Hermione Granger'
  const accountNumber = '1001'
  const balance = '5196'
  const currency = 'Dollar'
  const depositVal = '100'
  const withdrawVal = '200'
  const emptyAccount = '1003'

  before(() => {
    cy.visit('/')
  })

  it("should provide the ability to work with Hermione's bank account", () => {
    cy.contains('button', 'Customer Login').click()
    cy.get('[name="userSelect"]').select(userName)
    cy.contains('button', 'Login').click()

    cy.contains('[ng-hide="noAccount"]', 'Account Number : ')
      .contains('strong.ng-binding', accountNumber)
      .should('be.visible')
    cy.contains('[ng-hide="noAccount"]', 'Balance : ')
      .contains('strong', balance)
      .should('be.visible')
    cy.contains('[ng-hide="noAccount"]', 'Currency : ')
      .contains('strong', currency)
      .should('be.visible')

    cy.contains('button', 'Deposit').click()
    cy.get('[ng-model="amount"]').type(depositVal)
    cy.contains('button', 'Deposit').click()
    cy.get('[ng-show="message"]').should('contain.text', 'Deposit Successful')
    cy.contains('[ng-hide="noAccount"]', 'Balance : ')
      .contains('strong', balance)
      .should('be.visible')

    cy.get('[ng-click="withdrawl()"]').click()
    cy.get('[ng-model="amount"]').type(withdrawVal)
    cy.contains('button', 'Withdraw').click()
    cy.get('[ng-show="message"]').should(
      'contain.text',
      'Transaction successful'
    )
    cy.contains('[ng-hide="noAccount"]', 'Balance : ')
      .contains('strong', balance)
      .should('be.visible')

    cy.get('[ng-click="transactions()"]').click()
    cy.get('table').should('be.visible')
    cy.get('[ng-click="back()"]').click()

    cy.get('[ng-model="accountNo"]').select(emptyAccount)
    cy.get('[ng-click="transactions()"]').click()

    cy.get('tbody').find('tr').should('have.length', 0)

    cy.get('[ng-click="byebye()"]').click()
    cy.get('[name="userSelect"]').should('be.visible')
  })
})
