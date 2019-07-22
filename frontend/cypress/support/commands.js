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
Cypress.Commands.add('login', (url) => {
  // NB: Cypress drops the `CYPRESS__` prefix when using:
  expect(Cypress.env('ADMIN_USERNAME')).not.to.be.undefined
  expect(Cypress.env('ADMIN_PASSWORD')).not.to.be.undefined
  const login = url || 'https://firstvoices-dev.apps.prod.nuxeo.io/nuxeo/startup'
  // Login
  cy.log(`--- LOGGING IN (${login}) ---`)
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
  cy.getByTestId('AlphabetListView').within(() => {
    cy.getByText(_obj.letter).click()
  })

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

// DialectFilterList
//
// obj = {
//   category: undefined, // Category to click
//   confirmData: true, // Verify data exists after click (& after pagination if also set)
//   shouldPaginate: false, // Filtering should result in pagination, click next arrow
//   clearFilter: true // clear the filtering at end of test
// }
//
// eg:
// cy.DialectFilterList({
//   category: 'Animals',
//   confirmData: true,
//   shouldPaginate: true,
//   clearFilter: true,
// })
Cypress.Commands.add('DialectFilterList', (obj) => {
  const _obj = Object.assign(
    {category: undefined, confirmData: true, shouldPaginate: false, clearFilter: true},
    obj
  )
  cy.log('--- Running cypress/support/commands.js > DialectFilterList ---')
  cy.log('--- DialectFilterList: Filter by category  ---')
  // Filter by category
  cy.getByTestId('DialectFilterList').within(() => {
    cy.getByText(_obj.category).click()
  })

  if (_obj.confirmData) {
    cy.log('--- DialectFilterList: Confirm data  ---')
    // Confirm data
    cy.getByTestId('DictionaryList__row').should('exist')
  }

  if (_obj.shouldPaginate) {
    cy.log('--- DialectFilterList: Navigate to next page  ---')
    // Navigate to next page
    cy.getByTestId('pagination__next').click()

    if (_obj.confirmData) {
      cy.log('--- DialectFilterList: Confirm data  ---')
      // Confirm data
      cy.getByTestId('DictionaryList__row').should('exist')
    }
  }
  if (_obj.clearFilter) {
    cy.log('--- DialectFilterList: Clear filter ---')
    cy.queryByText(/stop browsing by category/i).click()
  }
})

// FlashcardList
//
// obj = {
//   confirmData: true, // Verify data exists after click (& after pagination if also set)
//   shouldPaginate: false, // Filtering should result in pagination, click next arrow
//   clearFilter: true // clear the filtering at end of test
// }
//
// eg:
// cy.FlashcardList({
//   confirmData: true,
//   shouldPaginate: true,
//   clearFilter: true,
// })
Cypress.Commands.add('FlashcardList', (obj) => {
  const _obj = Object.assign(
    {confirmData: true, shouldPaginate: false, clearFilter: true},
    obj
  )
  cy.log('--- Running cypress/support/commands.js > FlashcardList ---')

  cy.log('--- FlashcardList: Confirm not in flashcard mode  ---')
  cy.getByTestId('DictionaryList__row')

  cy.log('--- FlashcardList: Enter flashcard mode  ---')
  cy.queryByText(/flashcards/i).click()

  if (_obj.confirmData) {
    cy.log('--- FlashcardList: Confirm flashcard  ---')
    cy.getByTestId('Flashcard').should('exist')
  }

  if (_obj.shouldPaginate) {
    cy.log('--- FlashcardList: Paginate  ---')
    cy.getByTestId('pagination__next').click()

    if (_obj.confirmData) {
      cy.log('--- FlashcardList: Confirm flashcard  ---')
      cy.getByTestId('Flashcard').should('exist')
    }
  }
  if (_obj.clearFilter) {
    cy.log('--- FlashcardList: Leave flashcard mode  ---')
    cy.queryByText(/stop viewing flashcards/i).click()

    cy.log('--- FlashcardList: Confirm not in flashcard mode  ---')
    cy.getByTestId('DictionaryList__row').should('exist')
  }
})

/*
browseSearch({
  search
  word
  definitions
  literalTranslations
  partsOfSpeech
})

*/
// browseSearch
//
// eg:
// cy.browseSearch({
//   term: '',
//   searchWord: true,
//   searchDefinitions: true,
//   searchLiteralTranslations: false,
//   searchPartsOfSpeech: 'Noun',
//   confirmData: true,
//   shouldPaginate: false,
//   clearFilter: true,
// })
Cypress.Commands.add('browseSearch', (obj) => {
  const _obj = Object.assign(
    {
      btnSearch: 'search words',
      searchWord: true,
      searchDefinitions: true,
      searchLiteralTranslations: false,
      searchPartsOfSpeech: undefined,
      confirmData: true,
      confirmNoData: false,
      searchingText: 'Showing words that contain the search',
      shouldPaginate: false,
      clearFilter: true,
    },
    obj
  )

  const searchingByWordText = 'Word'
  const searchingByDefinitionsText = 'Definitions'
  const searchingByLiteralTranslationsText = 'Literal translations'
  const searchingByPartsOfSpeech = 'Parts of speech'
  cy.log('--- Running cypress/support/commands.js > browseSearch ---')

  cy.log('--- browseSearch: Searching  ---')
  cy.getByTestId('SearchDialectFormPrimaryInput').clear()
  if (_obj.term) {
    cy.getByTestId('SearchDialectFormPrimaryInput').type(_obj.term)
  }

  // set all search options:
  cy.getByTestId('SearchDialect').within(() => {
    _obj.searchWord ? cy.getByLabelText(new RegExp(searchingByWordText, 'i')).check() : cy.getByLabelText(new RegExp(searchingByWordText, 'i')).uncheck()
    _obj.searchDefinitions ? cy.getByLabelText(new RegExp(searchingByDefinitionsText, 'i')).check() : cy.getByLabelText(new RegExp(searchingByDefinitionsText, 'i')).uncheck()
    _obj.searchLiteralTranslations ? cy.getByLabelText(new RegExp(searchingByLiteralTranslationsText, 'i')).check() : cy.getByLabelText(new RegExp(searchingByLiteralTranslationsText, 'i')).uncheck()
    if (_obj.searchPartsOfSpeech) {
      cy.getByLabelText(new RegExp(searchingByPartsOfSpeech, 'i')).select(_obj.searchPartsOfSpeech)
    }
  })

  // Search
  cy.queryByText(new RegExp(_obj.btnSearch, 'i')).click()

  cy.log('--- browseSearch: Confirm in search mode  ---')
  cy.queryByText(new RegExp(_obj.searchingText, 'i')).should('exist')

  if (_obj.confirmData) {
    cy.log('--- browseSearch: Confirm data  ---')
    cy.getByTestId('DictionaryList__row').should('exist')
  }
  if (_obj.confirmNoData) {
    cy.log('--- browseSearch: Confirm no data  ---')
    cy.queryByText(/No results found/i).should('exist')
  }

  if (_obj.shouldPaginate) {
    cy.log('--- browseSearch: Paginate  ---')
    cy.getByTestId('pagination__next').click()

    if (_obj.confirmData) {
      cy.log('--- browseSearch: Confirm data  ---')
      cy.getByTestId('DictionaryList__row').should('exist')
    }
    if (_obj.confirmNoData) {
      cy.log('--- browseSearch: Confirm no data  ---')
      cy.queryByText(/No results found/i).should('exist')
    }
  }
  if (_obj.clearFilter) {
    cy.log('--- browseSearch: Reset search  ---')
    cy.queryByText(/reset search/i).click()

    cy.log('--- browseSearch: Confirm not in search mode (only when after clicking reset search)  ---')
    cy.queryByText(/Showing all words in the/i).should('exist')
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
