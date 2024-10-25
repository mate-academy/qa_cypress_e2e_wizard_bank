# Cypress: Wizard bank

## Workflow

1. Fork the repo.
1. Clone **your** forked repository.
1. Run the command `npm i`.
1. Create a new branch `git checkout -b testing`.
1. Resolve tasks in the `cypress`/`e2e`/`hermioneAccount.cy.js`.
1. Check yourself before submitting the task with a [Cypress checklist](https://mate-academy.github.io/qa-program/checklists/cypress.html).
1. Create a pull request.
1. Do not forget to click on `Re-request review` if you submit the homework after previous review.

## Task

App for testing: [GlobalsQa](https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login)

**Your task** is to check next flow:

1. Click **[Customer Login]**
1. Select **Hermione Granger**
1. Click **[Login]**
1. Assert Account Number (e.g. `1001`)
1. Assert Balance
1. Assert Currency
1. Click **[Deposit]**
1. Type deposit value
1. Click **[Deposit]**
1. Assert success message
1. Assert Balance
1. Click **[Withdrawl]**
1. Type amount of money to withdraw
1. Click **[Withdraw]**
1. Assert success message
1. Assert Balance
1. Click **[Transacrions]**
1. Assert both transactions details: Deposite and Withdraw
1. Click **[Back]**
1. Change Account number
1. Click **[Transacrions]**
1. Assert no transactions for this account
1. Click **[Logout]**
1. Assert using is logged out

You can find an example in the `example.spec.js` file.

## Advanced level

Try to implement more testing flow in a separate file.  
Try to use `faker` to generate test data.
