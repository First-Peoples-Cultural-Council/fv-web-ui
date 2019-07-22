import 'cypress-testing-library/add-commands'
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// Login
Cypress.Commands.add('login', () => {
  // NB: Cypress drops the `CYPRESS__` prefix when using:
  expect(Cypress.env('ADMIN_USERNAME')).not.to.be.undefined
  expect(Cypress.env('ADMIN_PASSWORD')).not.to.be.undefined
  const login = 'https://firstvoices-dev.apps.prod.nuxeo.io/nuxeo/startup'
  // Login
  cy.log('--- LOGGING IN ---')
  cy.request({
    method: 'POST',
    url: login,
    form: true, // we are submitting a regular form body
    body: {
      user_name: Cypress.env('ADMIN_USERNAME'),
      user_password: Cypress.env('ADMIN_PASSWORD'),
      language: 'en',
      requestedUrl: 'app',
      forceAnonymousLogin: true,
      form_submitted_marker: undefined,
      Submit: 'Log+In',
    },
  })
  cy.log('--- SHOULD BE LOGGED IN ---')
})

// AlphabetListView
//
// obj = {
//   letter: undefined, // Letter to click
//   confirmData: true, // Verify data exists after click (& after pagination if also set)
//   shouldPaginate: false, // Filtering should result in pagination, click next arrow
//   clearFilter: true // clear the filtering at end of test
// }
//
// eg:
// cy.AlphabetListView({
//   letter: 'k̓',
//   confirmData: true,
//   shouldPaginate: true,
//   clearFilter: true,
// })
Cypress.Commands.add('AlphabetListView', (obj) => {
  const _obj = Object.assign(
    {letter: undefined, confirmData: true, shouldPaginate: false, clearFilter: true},
    obj
  )
  cy.log('--- Running cypress/support/commands.js > AlphabetListView ---')
  cy.log('--- AlphabetListView: Filter by letter  ---')
  // Filter by letter
  cy.getByText(_obj.letter).click()

  if (_obj.confirmData) {
    cy.log('--- AlphabetListView: Confirm data  ---')
    // Confirm data
    cy.getByTestId('DictionaryList__row').should('exist')
  }

  if (_obj.shouldPaginate) {
    cy.log('--- AlphabetListView: Navigate to next page  ---')
    // Navigate to next page
    cy.getByTestId('pagination__next').click()

    if (_obj.confirmData) {
      cy.log('--- AlphabetListView: Confirm data  ---')
      // Confirm data
      cy.getByTestId('DictionaryList__row').should('exist')
    }
  }
  if (_obj.clearFilter) {
    cy.log('--- AlphabetListView: Clear filter ---')
    cy.queryByText(/stop browsing alphabetically/i).click()
  }
})

// AlphabetListView
//
// obj = {
//   letter: undefined, // Letter to click
//   confirmData: true, // Verify data exists after click (& after pagination if also set)
//   shouldPaginate: false, // Filtering should result in pagination, click next arrow
//   clearFilter: true // clear the filtering at end of test
// }
//
// eg:
// cy.AlphabetListView({
//   letter: 'k̓',
//   confirmData: true,
//   shouldPaginate: true,
//   clearFilter: true,
// })
Cypress.Commands.add('AlphabetListView', (obj) => {
  const _obj = Object.assign(
    {letter: undefined, confirmData: true, shouldPaginate: false, clearFilter: true},
    obj
  )
  cy.log('--- Running cypress/support/commands.js > AlphabetListView ---')
  cy.log('--- AlphabetListView: Filter by letter  ---')
  // Filter by letter
  cy.getByText(_obj.letter).click()

  if (_obj.confirmData) {
    cy.log('--- AlphabetListView: Confirm data  ---')
    // Confirm data
    cy.getByTestId('DictionaryList__row').should('exist')
  }

  if (_obj.shouldPaginate) {
    cy.log('--- AlphabetListView: Navigate to next page  ---')
    // Navigate to next page
    cy.getByTestId('pagination__next').click()

    if (_obj.confirmData) {
      cy.log('--- AlphabetListView: Confirm data  ---')
      // Confirm data
      cy.getByTestId('DictionaryList__row').should('exist')
    }
  }
  if (_obj.clearFilter) {
    cy.log('--- AlphabetListView: Clear filter ---')
    cy.queryByText(/stop browsing alphabetically/i).click()
  }
})

// Create contributor
Cypress.Commands.add('createContributor', () => {
  cy.log('--- Running createContributor ---')
  return cy.request({
    method: 'POST',
    url: 'https://firstvoices-dev.apps.prod.nuxeo.io/nuxeo/api/v1/path/FV/Workspaces/Data/Athabascan/Dene/Dene/Contributors',
    body: {
      'entity-type': 'document',
      'type': 'FVContributor',
      'name': 'AAA cy.createContributor() > dc:title [CY]',
      'properties': {'dc:description': '<p>AAA cy.createContributor() > dc:description [CY]</p>', 'dc:title': 'AAA cy.createContributor() > dc:title [CY]'},
    },
  })
})
// Delete contributor
Cypress.Commands.add('deleteContributor', (uid) => {
  cy.log('--- Running deleteContributor ---')
  return cy.request({
    method: 'POST',
    url: 'https://firstvoices-dev.apps.prod.nuxeo.io/nuxeo/api/v1/automation/Document.Trash',
    body: {
      'params': {},
      'context': {},
      'input': uid,
    },
  })
})
