import 'cypress-testing-library/add-commands'
import 'cypress-file-upload'
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

beforeEach(function() {
  cy.log('NOTE: Tests are typically run with `npm run startPreprod`')
  cy.log('NOTE: We will be migrating the tests to dev sandbox soon`')
})
afterEach(function() {
  // Logout to fix issue with user being logged in between tests.
  cy.logout()
  cy.log('Test complete')
  // Wait to ensure video recording is not cut early on failed test.
  cy.wait(1000)
})

// Login
// Defaults:
// cy.login({
//   userName: 'ADMIN_USERNAME',
//   userPassword: 'ADMIN_PASSWORD',
//   url: 'https://preprod.firstvoices.com/nuxeo/startup',
//   body: {
//     user_name: obj.userName,
//     user_password: obj.userPassword,
//     language: 'en',
//     requestedUrl: 'nxstartup.faces',
//     forceAnonymousLogin: true,
//     form_submitted_marker: undefined,
//     Submit: 'Log+In',
//   },
// })
Cypress.Commands.add('login', (obj = {}) => {
  cy.log('Confirming environment variables are set...')
  // NOTE: Cypress drops the `CYPRESS_` prefix when using environment variables set in your bash file
  const userName = (obj.userName || Cypress.env('ADMIN_USERNAME'))
  const userPassword = Cypress.env(obj.userPassword || 'FV_PASSWORD' || 'ADMIN_PASSWORD')
  let loginInfoExists = false
  if (userName != undefined && userPassword != undefined) {
    loginInfoExists = true
    cy.log('Login info found successfully').then(() => {
      expect(loginInfoExists).to.be.true
    })
  } else {
    cy.log('Error: Login info not found').then(() => {
      expect(loginInfoExists).to.be.true
    })
  }

  const url = obj.url || (Cypress.env('FRONTEND') + '/nuxeo/startup')
  const body = obj.body || {
    user_name: userName,
    user_password: userPassword,
    language: 'en',
    requestedUrl: 'nxstartup.faces',
    forceAnonymousLogin: true,
    form_submitted_marker: undefined,
    Submit: 'Log+In',
  }
  // Login
  cy.log(`--- LOGGING IN: ${url} ---`)
  cy.log(`--- USER IS: ${userName} ---`)
  cy.request({
    method: 'POST',
    url,
    form: true, // we are submitting a regular form body
    body,
  })
  cy.wait(1000)
  cy.log('--- SHOULD BE LOGGED IN ---')
})

// Logs any user out using a GET request.
Cypress.Commands.add('logout', () => {
  cy.log('--- LOGGING OUT ---')
  cy.request({method: 'GET', url: (Cypress.env('TARGET') + '/nuxeo/logout'), failOnStatusCode: false})
  cy.visit('')
  cy.wait(1000)
})


Cypress.Commands.add('logger', ({type = 'header', text = ''}) => {
  const divider = '====================================='
  const subdivider = '-------------------------------------'
  switch (type) {
    case 'header':
      cy.log(divider)
      cy.log(text)
      cy.log(divider)
      break
    case 'subheader':
      cy.log(subdivider)
      cy.log(text)
      cy.log(subdivider)
      break
    default:
      break
  }
})

Cypress.Commands.add('abort', () => {
  const subdivider = '-------------------------------------'
  cy.log(subdivider)
  cy.expect('STOP TEST').to.equal(true)
  cy.log(subdivider)
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
  cy.wait(500)

  if (_obj.confirmData) {
    cy.log('--- AlphabetListView: Confirm data  ---')
    // Confirm data
    cy.getByTestId('DictionaryList__row').should('exist')
  }

  if (_obj.shouldPaginate) {
    cy.log('--- AlphabetListView: Navigate to next page  ---')
    // Navigate to next page
    cy.wait(500)
    cy.getByTestId('pagination__next').click()
    cy.wait(500)

    if (_obj.confirmData) {
      cy.log('--- AlphabetListView: Confirm data  ---')
      // Confirm data
      cy.wait(500)
      cy.getByTestId('DictionaryList__row').should('exist')
    }
  }
  if (_obj.clearFilter) {
    cy.log('--- AlphabetListView: Clear filter ---')
    cy.queryByText(/stop browsing alphabetically/i).click()
  }
  cy.wait(3000)
})

// DialectFilterList
//
// obj = {
//   category: undefined, // Category to click
//   confirmData: true, // Verify data exists after click (& after pagination if also set)
//   shouldPaginate: false, // Filtering should result in pagination, click next arrow
//   clearFilter: true // clear the filtering at end of test
//   clearFilterText: 'button text' // text for clear button
// }
//
// eg:
// cy.DialectFilterList({
//   category: 'Animals',
//   confirmData: true,
//   shouldPaginate: true,
//   clearFilter: true,
//   clearFilterText: ''
// })
Cypress.Commands.add('DialectFilterList', (obj) => {
  const _obj = Object.assign(
    {category: undefined, confirmData: true, shouldPaginate: false, clearFilter: true, clearFilterText: 'stop browsing by category'},
    obj
  )
  cy.log('--- Running cypress/support/commands.js > DialectFilterList ---')
  cy.log('--- DialectFilterList: Filter by category  ---')
  // Filter by category
  cy.wait(1500)
  cy.getByTestId('DialectFilterList').within(() => {
    cy.getByText(_obj.category).click()
  })
  cy.wait(500)

  if (_obj.confirmData) {
    cy.log('--- DialectFilterList: Confirm data  ---')
    // Confirm data
    cy.getByTestId('DictionaryList__row').should('exist')
  }

  if (_obj.shouldPaginate) {
    cy.log('--- DialectFilterList: Navigate to next page  ---')
    // Navigate to next page
    cy.wait(500)
    cy.getByTestId('pagination__next').click()
    cy.wait(500)

    if (_obj.confirmData) {
      cy.log('--- DialectFilterList: Confirm data  ---')
      // Confirm data
      cy.wait(500)
      cy.getByTestId('DictionaryList__row').should('exist')
    }
  }
  if (_obj.clearFilter) {
    cy.log('--- DialectFilterList: Clear filter ---')
    cy.queryByText(new RegExp(_obj.clearFilterText, 'i')).click()
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
  cy.queryByText(/Flashcard view/i).click()
  cy.wait(500)

  if (_obj.confirmData) {
    cy.log('--- FlashcardList: Confirm flashcard  ---')
    cy.getByTestId('Flashcard').should('exist')
  }

  if (_obj.shouldPaginate) {
    cy.log('--- FlashcardList: Paginate  ---')
    cy.wait(500)
    cy.getByTestId('pagination__next').click()

    if (_obj.confirmData) {
      cy.log('--- FlashcardList: Confirm flashcard  ---')
      cy.wait(500)
      cy.getByTestId('Flashcard').should('exist')
    }
  }
  if (_obj.clearFilter) {
    cy.log('--- FlashcardList: Leave flashcard mode  ---')
    cy.queryByText(/Cancel flashcard view/i).click()

    cy.log('--- FlashcardList: Confirm not in flashcard mode  ---')
    cy.getByTestId('DictionaryList__row').should('exist')
  }
})

// browseSearch
//
Cypress.Commands.add('browseSearch', (obj) => {
  const _obj = Object.assign(
    {
      btnSearch: 'search words',
      searchWord: undefined,
      searchPhrase: undefined,
      searchDefinitions: true,
      searchLiteralTranslations: undefined,
      searchCulturalNotes: undefined,
      searchPartsOfSpeech: undefined,
      confirmData: true,
      confirmNoData: false,
      searchingText: 'Showing words that contain the search',
      postClearFilterText: 'Showing all words in the',
      shouldPaginate: false,
      clearFilter: true,
    },
    obj
  )

  const searchingByWordText = 'Word'
  const searchingByPhraseText = 'Phrase'
  const searchingByDefinitionsText = 'Definitions'
  const searchingByLiteralTranslationsText = 'Literal translations'
  const searchingByCulturalNotesText = 'Cultural notes'
  const searchingByPartsOfSpeech = 'Parts of speech'

  cy.log('--- Running cypress/support/commands.js > browseSearch ---')

  cy.log('--- browseSearch: Searching  ---')
  cy.getByTestId('SearchDialectFormPrimaryInput').clear()
  if (_obj.term) {
    cy.getByTestId('SearchDialectFormPrimaryInput').type(_obj.term)
  }

  // set all search options:
  cy.getByTestId('SearchDialect').within(() => {
    if (_obj.searchWord !== undefined) {
      _obj.searchWord ? cy.getByLabelText(new RegExp(searchingByWordText, 'i')).check() : cy.getByLabelText(new RegExp(searchingByWordText, 'i')).uncheck()
    }
    if (_obj.searchPhrase !== undefined) {
      _obj.searchPhrase ? cy.getByLabelText(new RegExp(searchingByPhraseText, 'i')).check() : cy.getByLabelText(new RegExp(searchingByPhraseText, 'i')).uncheck()
    }

    _obj.searchDefinitions ? cy.getByLabelText(new RegExp(searchingByDefinitionsText, 'i')).check() : cy.getByLabelText(new RegExp(searchingByDefinitionsText, 'i')).uncheck()
    if (_obj.searchLiteralTranslations !== undefined) {
      _obj.searchLiteralTranslations ? cy.getByLabelText(new RegExp(searchingByLiteralTranslationsText, 'i')).check() : cy.getByLabelText(new RegExp(searchingByLiteralTranslationsText, 'i')).uncheck()
    }
    if (_obj.searchCulturalNotes !== undefined) {
      _obj.searchCulturalNotes ? cy.getByLabelText(new RegExp(searchingByCulturalNotesText, 'i')).check() : cy.getByLabelText(new RegExp(searchingByCulturalNotesText, 'i')).uncheck()
    }
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
    cy.wait(500)
    cy.getByTestId('pagination__next').click()

    if (_obj.confirmData) {
      cy.log('--- browseSearch: Confirm data  ---')
      cy.wait(500)
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
    cy.queryByText(new RegExp(_obj.postClearFilterText, 'i')).should('exist')
  }
})

// Create contributor
Cypress.Commands.add('createContributor', () => {
  cy.log('--- Running createContributor ---')
  return cy.request({
    method: 'POST',
    url: 'http://127.0.0.1:3001/nuxeo/api/v1/path/FV/Workspaces/Data/Test/Test/TestLanguageTwo/Contributors',
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
    url: 'http://127.0.0.1:3001/nuxeo/api/v1/automation/Document.Trash',
    body: {
      'params': {},
      'context': {},
      'input': uid,
    },
  })
})
