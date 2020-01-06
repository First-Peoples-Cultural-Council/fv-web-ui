// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// https://www.cypress.io/blog/2019/01/22/when-can-the-test-click/
// https://github.com/NicholasBoll/cypress-pipe
import 'cypress-pipe'

// NOTE: turn off all uncaught exception handling
cy.on('uncaught:exception', () => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

// Alternatively you can use CommonJS syntax:
// require('./commands')

Cypress.Screenshot.defaults({
  screenshotOnRunFailure: true,
})
