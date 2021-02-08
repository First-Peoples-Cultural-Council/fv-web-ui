import '@testing-library/cypress/add-commands'
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

beforeEach(() => {
  // Logout to fix issue with user being logged in between tests.
  cy.logout()
})

afterEach(() => {
  cy.log('Test complete')
  // TODO: could we...
  // TODO: a) not need to wait?
  // TODO: b) if we do need to wait, only wait when we are recording?
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
  const userName = obj.userName || Cypress.env('ADMIN_USERNAME')
  const userPassword = obj.userPassword || Cypress.env('FV_PASSWORD') || Cypress.env('ADMIN_PASSWORD')
  let loginInfoExists = false
  if (userName != undefined && userPassword != undefined) {
    loginInfoExists = true
    cy.log('Login info found successfully').then(() => {
      expect(loginInfoExists).to.be.true
    })
  } else {
    cy.log('Error: Login info not found').then(() => {
      expect(loginInfoExists).to.be.false
    })
  }

  const url = obj.url || Cypress.env('FRONTEND') + '/nuxeo/startup'
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
  cy.wait(2000)
  cy.reload(true)
  cy.log('--- SHOULD BE LOGGED IN ---')
})

// Logs any user out using a GET request.
Cypress.Commands.add('logout', () => {
  cy.log('--- LOGGING OUT ---')
  cy.request({ method: 'GET', url: Cypress.env('FRONTEND') + '/nuxeo/logout', failOnStatusCode: false })
  cy.visit('')
  cy.wait(2000)
  cy.log('--- SHOULD BE LOGGED OUT ---')
})

Cypress.Commands.add('logger', ({ type = 'header', text = '' }) => {
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

// AlphabetCharacters
//
// obj = {
//   letter: undefined, // Letter to click
//   confirmData: true, // Verify data exists after click (& after pagination if also set)
//   shouldPaginate: false, // Filtering should result in pagination, click next arrow
//   clearFilter: true // clear the filtering at end of test
// }
//
// eg:
// cy.AlphabetCharacters({
//   letter: 'k̓',
//   confirmData: true,
//   shouldPaginate: true,
//   clearFilter: true,
// })
Cypress.Commands.add('AlphabetCharacters', (obj) => {
  const _obj = Object.assign({ letter: undefined, confirmData: true, shouldPaginate: false, clearFilter: true }, obj)
  cy.log('--- Running cypress/support/commands.js > AlphabetCharacters ---')
  cy.log('--- AlphabetCharacters: Filter by letter  ---')
  // Filter by letter
  cy.findByTestId('AlphabetCharacters').within(() => {
    cy.findByText(_obj.letter).click()
  })
  cy.wait(500)

  if (_obj.confirmData) {
    cy.log('--- AlphabetCharacters: Confirm data  ---')
    // Confirm data
    cy.findByTestId('DictionaryList__row').should('exist')
  }

  if (_obj.shouldPaginate) {
    cy.log('--- AlphabetCharacters: Navigate to next page  ---')
    // Navigate to next page
    cy.wait(500)
    cy.findByTestId('pagination__next').click()
    cy.wait(500)

    if (_obj.confirmData) {
      cy.log('--- AlphabetCharacters: Confirm data  ---')
      // Confirm data
      cy.wait(500)
      cy.findByTestId('DictionaryList__row').should('exist')
    }
  }
  if (_obj.clearFilter) {
    cy.log('--- AlphabetCharacters: Clear filter ---')
    cy.findByText(/stop browsing alphabetically/i).click()
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
    {
      category: undefined,
      confirmData: true,
      shouldPaginate: false,
      clearFilter: true,
      clearFilterText: 'stop browsing by category',
      confirmActiveClass: false,
      activeClassName: '',
    },
    obj
  )
  cy.log('--- Running cypress/support/commands.js > DialectFilterList ---')
  cy.log('--- DialectFilterList: Filter by category  ---')
  // Filter by category
  cy.wait(1500)
  cy.findByTestId('DialectFilterList').within(() => {
    cy.findByText(_obj.category).click()
  })
  cy.wait(500)
  if (_obj.confirmActiveClass) {
    cy.findByTestId('DialectFilterList').within(() => {
      cy.findByText(_obj.category).should('have.class', _obj.activeClassName)
    })
  }

  if (_obj.confirmData) {
    cy.log('--- DialectFilterList: Confirm data  ---')
    // Confirm data
    cy.findByTestId('DictionaryList__row').should('exist')
  }

  if (_obj.shouldPaginate) {
    cy.log('--- DialectFilterList: Navigate to next page  ---')
    // Navigate to next page
    cy.wait(500)
    cy.findByTestId('pagination__next').click()
    cy.wait(500)

    if (_obj.confirmData) {
      cy.log('--- DialectFilterList: Confirm data  ---')
      // Confirm data
      cy.wait(500)
      cy.findByTestId('DictionaryList__row').should('exist')
    }
  }
  if (_obj.clearFilter) {
    cy.log('--- DialectFilterList: Clear filter ---')
    cy.findByText(new RegExp(_obj.clearFilterText, 'i')).click()
    if (_obj.confirmActiveClass) {
      cy.findByTestId('DialectFilterList').within(() => {
        cy.findByText(_obj.category).should('not.have.class', _obj.activeClassName)
      })
    }
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
  const _obj = Object.assign({ confirmData: true, shouldPaginate: false, clearFilter: true }, obj)
  cy.log('--- Running cypress/support/commands.js > FlashcardList ---')

  cy.log('--- FlashcardList: Confirm not in flashcard mode  ---')
  cy.findByTestId('DictionaryList__row')

  cy.log('--- FlashcardList: Enter flashcard mode  ---')
  cy.findByText(/Flashcard view/i).click()
  cy.wait(500)

  if (_obj.confirmData) {
    cy.log('--- FlashcardList: Confirm flashcard  ---')
    cy.findByTestId('Flashcard').should('exist')
  }

  if (_obj.shouldPaginate) {
    cy.log('--- FlashcardList: Paginate  ---')
    cy.wait(500)
    cy.findByTestId('pagination__next').click()

    if (_obj.confirmData) {
      cy.log('--- FlashcardList: Confirm flashcard  ---')
      cy.wait(500)
      cy.findByTestId('Flashcard').should('exist')
    }
  }
  if (_obj.clearFilter) {
    cy.log('--- FlashcardList: Leave flashcard mode  ---')
    cy.findByText(/Cancel flashcard view/i).click()

    cy.log('--- FlashcardList: Confirm not in flashcard mode  ---')
    cy.findByTestId('DictionaryList__row').should('exist')
  }
})

// browseSearch
//
Cypress.Commands.add('browseSearch', (obj) => {
  const searchTypeString = ['Approximate', 'Exact', 'Contains', 'Starts with', 'Ends with', 'Wildcard']
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
      searchingText: 'Showing words that',
      postClearFilterText: 'Showing all words in the',
      shouldPaginate: false,
      clearFilter: true,
      searchType: 2,
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
  cy.findByTestId('SearchDialectFormPrimaryInput').clear()
  if (_obj.term) {
    cy.findByTestId('SearchDialectFormPrimaryInput').type(_obj.term)
  }

  // set all search options:
  cy.findByTestId('SearchDialect').within(() => {
    cy.findByTestId('SearchDialectFormSelectSearchType').select(searchTypeString[_obj.searchType])

    if (_obj.searchWord !== undefined) {
      _obj.searchWord
        ? cy.findByLabelText(new RegExp(searchingByWordText, 'i')).check()
        : cy.findByLabelText(new RegExp(searchingByWordText, 'i')).uncheck()
    }
    if (_obj.searchPhrase !== undefined) {
      _obj.searchPhrase
        ? cy.findByLabelText(new RegExp(searchingByPhraseText, 'i')).check()
        : cy.findByLabelText(new RegExp(searchingByPhraseText, 'i')).uncheck()
    }

    _obj.searchDefinitions
      ? cy.findByLabelText(new RegExp(searchingByDefinitionsText, 'i')).check()
      : cy.findByLabelText(new RegExp(searchingByDefinitionsText, 'i')).uncheck()
    if (_obj.searchLiteralTranslations !== undefined) {
      _obj.searchLiteralTranslations
        ? cy.findByLabelText(new RegExp(searchingByLiteralTranslationsText, 'i')).check()
        : cy.findByLabelText(new RegExp(searchingByLiteralTranslationsText, 'i')).uncheck()
    }
    if (_obj.searchCulturalNotes !== undefined) {
      _obj.searchCulturalNotes
        ? cy.findByLabelText(new RegExp(searchingByCulturalNotesText, 'i')).check()
        : cy.findByLabelText(new RegExp(searchingByCulturalNotesText, 'i')).uncheck()
    }
    if (_obj.searchPartsOfSpeech) {
      cy.findByLabelText(new RegExp(searchingByPartsOfSpeech, 'i')).select(_obj.searchPartsOfSpeech)
    }
  })

  // Search
  cy.findByText(new RegExp(_obj.btnSearch, 'i')).click()

  cy.log('--- browseSearch: Confirm in search mode  ---')
  cy.findByText(new RegExp(_obj.searchingText, 'i')).should('exist')

  if (_obj.confirmData) {
    cy.log('--- browseSearch: Confirm data  ---')
    cy.findByTestId('DictionaryList__row').should('exist')
  }
  if (_obj.confirmNoData) {
    cy.log('--- browseSearch: Confirm no data  ---')
    cy.findByText(/No results found/i).should('exist')
  }

  if (_obj.shouldPaginate) {
    cy.log('--- browseSearch: Paginate  ---')
    cy.wait(500)
    cy.findByTestId('pagination__next').click()

    if (_obj.confirmData) {
      cy.log('--- browseSearch: Confirm data  ---')
      cy.wait(500)
      cy.findByTestId('DictionaryList__row').should('exist')
    }
    if (_obj.confirmNoData) {
      cy.log('--- browseSearch: Confirm no data  ---')
      cy.findByText(/No results found/i).should('exist')
    }
  }
  if (_obj.clearFilter) {
    cy.log('--- browseSearch: Reset search  ---')
    cy.findByText(/reset search/i).click()

    cy.log('--- browseSearch: Confirm not in search mode (only when after clicking reset search)  ---')
    cy.findByText(new RegExp(_obj.postClearFilterText, 'i')).should('exist')
  }
})

// Create contributor
Cypress.Commands.add('createContributor', (dialectString) => {
  cy.log('--- Running createContributor ---')
  return cy.request({
    method: 'POST',
    url: Cypress.env('FRONTEND') + '/nuxeo/api/v1/path/FV/Workspaces/Data/Test/Test/' + dialectString + '/Contributors',
    body: {
      'entity-type': 'document',
      type: 'FVContributor',
      name: ' Test Contributor name [CY]',
      properties: {
        'dc:description': '<p>Test Contributor dc:description [CY]</p>',
        'dc:title': ' Test Contributor dc:title [CY]',
      },
    },
  })
})
// Delete contributor
Cypress.Commands.add('deleteContributor', (uid) => {
  cy.log('--- Running deleteContributor ---')
  return cy.request({
    method: 'POST',
    url: Cypress.env('FRONTEND') + '/nuxeo/api/v1/automation/Document.Trash',
    body: {
      params: {},
      context: {},
      input: uid,
    },
  })
})

// ===============================================
// formClickAllXs
// ===============================================
Cypress.Commands.add('formClickAllXs', () => {
  cy.logger({ type: 'subheader', text: 'formClickAllXs' })
  cy.get('.btn-remove').each(($el, index, $list) => {
    const reversedIndex = $list.length - 1 - index
    cy.wrap($list[reversedIndex]).click()
  })
  cy.get('[data-testid=IconButton__remove]').each(($el, index, $list) => {
    const reversedIndex = $list.length - 1 - index
    cy.wrap($list[reversedIndex]).click()
  })
})

// ===============================================
// formPopulateRelatedAudio
// ===============================================
Cypress.Commands.add('formPopulateRelatedAudio', ({ name, description }) => {
  cy.logger({ type: 'subheader', text: 'formPopulateRelatedAudio' })
  cy.findByText('Related Audio')
    .parents('fieldset:first')
    .within(() => {
      cy.findByText('+ Add related audio', { exact: false }).parents('button:first').click()

      cy.findByText('upload audio', { exact: false }).click()
    })
  cy.findByTestId('AddMediaComponent').within(() => {
    // Note: There are duplicate IDs because of modals & tcomb-form
    // So we can't use getByLabelText. Have to getByText and move up the dom
    cy.findByText('name', { exact: false }).parent().find('input[type=text]').type(name)
    cy.findByText('description', { exact: false }).parent().find('textarea').type(description)
    cy.findByText('Shared across dialects', { exact: false }).parent().find('input[type=checkbox]').check()
    cy.findByText('Child focused', { exact: false }).parent().find('input[type=checkbox]').check()

    const fileName = 'TestRelatedAudio.wav'
    cy.fixture(fileName, 'base64').then((fileContent) => {
      cy.get('input[type=file]').attachFile({ fileContent, fileName, mimeType: 'audio/wav', encoding: 'base64' })
    })
    cy.findByText('Upload Media', { exact: true }).click()
  })
})

// ===============================================
// formPopulateRelatedPictures
// ===============================================
Cypress.Commands.add('formPopulateRelatedPictures', ({ name, description }) => {
  cy.logger({ type: 'subheader', text: 'formPopulateRelatedPictures' })
  cy.findByText('Related Pictures')
    .parents('fieldset:first')
    .within(() => {
      cy.findByText('+ Add related pictures', { exact: false }).parents('button:first').click()

      cy.findByText('upload picture', { exact: false }).click()
    })
  cy.findByTestId('AddMediaComponent').within(() => {
    // Note: There are duplicate IDs because of modals & tcomb-form
    // So we can't use getByLabelText. Have to getByText and move up the dom
    cy.findByText('name', { exact: false }).parent().find('input[type=text]').type(name)
    cy.findByText('description', { exact: false }).parent().find('textarea').type(description)
    cy.findByText('Shared across dialects', { exact: false }).parent().find('input[type=checkbox]').check()
    cy.findByText('Child focused', { exact: false }).parent().find('input[type=checkbox]').check()
    const fileName = 'TestRelatedImage.png'
    cy.fixture(fileName, 'base64').then((fileContent) => {
      cy.get('[name="file"]').attachFile({ fileContent, fileName, mimeType: 'image/png', encoding: 'base64' })
    })
    cy.findByText('Upload Media', { exact: true }).click()
  })
})

// ===============================================
// formPopulateRelatedVideos
// ===============================================
Cypress.Commands.add('formPopulateRelatedVideos', ({ name, description }) => {
  cy.logger({ type: 'subheader', text: 'formPopulateRelatedVideos' })
  cy.findByText('Related Videos')
    .parents('fieldset:first')
    .within(() => {
      cy.findByText('+ Add related videos', { exact: false }).parents('button:first').click()

      cy.findByText('upload video', { exact: false }).click()
    })
  cy.findByTestId('AddMediaComponent').within(() => {
    // Note: There are duplicate IDs because of modals & tcomb-form
    // So we can't use getByLabelText. Have to getByText and move up the dom
    cy.findByText('name', { exact: false }).parent().find('input[type=text]').type(name)
    cy.findByText('description', { exact: false }).parent().find('textarea').type(description)
    cy.findByText('Shared across dialects', { exact: false }).parent().find('input[type=checkbox]').check()
    cy.findByText('Child focused', { exact: false }).parent().find('input[type=checkbox]').check()
    const fileName = 'TestRelatedVideo.mp4'
    cy.fixture(fileName, 'base64').then((fileContent) => {
      cy.get('[name="file"]').attachFile({ fileContent, fileName, mimeType: 'video/mp4', encoding: 'base64' })
    })
    cy.findByText('Upload Media', { exact: true }).click()
  })
})

// ===============================================
// formBrowseMediaSelectItem
// ===============================================
Cypress.Commands.add(
  'formBrowseMediaSelectItem',
  ({ sectionTitle, sectionTitleExact = false, addButtonText, browseButtonText, mediaTitle }) => {
    cy.logger({ type: 'subheader', text: 'formBrowseMediaSelectItem' })
    cy.findByText(sectionTitle, { exact: sectionTitleExact })
      .parents('fieldset:first')
      .within(() => {
        cy.findByText(addButtonText, { exact: false }).parents('button:first').click()

        cy.findByText(browseButtonText, { exact: false }).click()
      })
    cy.wait(1000)
    cy.findByText('select existing', { exact: false }).should('exist')
    cy.findByTestId('withFilter').within(() => {
      cy.findByTestId('properties.dc-title').type(mediaTitle, { timeout: 8000 })
      cy.findByText('Filter').click()
    })
    cy.wait(500)
    cy.findByTestId('MediaList').within(() => {
      cy.findByLabelText(`${mediaTitle}`, { exact: false }).click()
    })
  }
)

// ===============================================
// formBrowseTableSelectItem
// ===============================================
Cypress.Commands.add(
  'formBrowseTableSelectItem',
  ({ sectionTitle, sectionTitleExact = false, addButtonText, browseButtonText, itemTitle }) => {
    cy.logger({ type: 'subheader', text: 'formBrowseTableSelectItem' })
    cy.findByText(sectionTitle, { exact: sectionTitleExact })
      .parents('fieldset:first')
      .within(() => {
        cy.findByText(addButtonText, { exact: false }).click()

        cy.findByText(browseButtonText, { exact: false }).click()
      })
    cy.wait(1000)
    cy.findByTestId('BrowseComponent__dialogContent').within(() => {
      cy.findByText(`${itemTitle}`, { exact: false })
        .parent('[data-testid=DictionaryList__row]')
        .within(() => {
          cy.findByText('select', { exact: false }).click()
        })
    })
  }
)

// ===============================================
// formPopulateSource
// ===============================================
Cypress.Commands.add('formPopulateSource', ({ name }) => {
  cy.logger({ type: 'subheader', text: 'formPopulateSource' })
  cy.findByText('Source')
    .parent()
    .within(() => {
      cy.findByText('+ Add source', { exact: false }).click()
      cy.findByText('create new contributor', { exact: false }).click()
    })
  cy.findByTestId('DialogCreateForm__DialogContent').within(() => {
    cy.findByText('Contributor name', { exact: false })
      .parent()
      .within(() => {
        cy.get('input[type=text]').type(name)
      })
    cy.findByText('save', { exact: false }).click()
  })
})

// ===============================================
// formPopulateDefinitions
// ===============================================
Cypress.Commands.add('formPopulateDefinitions', ({ definition }) => {
  cy.logger({ type: 'subheader', text: 'formPopulateDefinitions' })

  cy.findByText('Definitions', { exact: false })
    .parents('fieldset:first')
    .within(() => {
      cy.findByText('+ Add definition', { exact: false }).click()
      cy.findByLabelText('translation', { exact: false }).type(definition)
    })
})

// ===============================================
// formPopulateCulturalNotes
// ===============================================
Cypress.Commands.add('formPopulateCulturalNotes', ({ prefix }) => {
  cy.logger({ type: 'subheader', text: 'formPopulateCulturalNotes' })

  cy.findByText('Cultural Note', { exact: true })
    .parent()
    .within(() => {
      cy.findByText('+ Add cultural note', { exact: false }).click()
      cy.logger({ type: 'subheader', text: 'Create 2 cultural notes' })
      cy.findByTestId('fv-cultural_note0').type(`${prefix} cultural note 0`)
      cy.findByText('+ Add cultural note', { exact: false }).click()
      cy.logger({ type: 'subheader', text: 'Change order' })
      cy.findByTestId('fv-cultural_note1').type(`${prefix} cultural note 1`)
      cy.findByTestId('fv-cultural_note1')
        .parent()
        .parent()
        .parent()
        .parent()
        .within(() => {
          cy.findByText('▲').click()
        })
    })
  cy.logger({ type: 'subheader', text: 'Confirm order' })
  cy.findByText('Cultural Note', { exact: true })
    .parent()
    .within(() => {
      cy.get('input.form-control[type=text]:first').invoke('val').should('be.eq', `${prefix} cultural note 1`)
    })
})

Cypress.Commands.add(
  'clickandwait',
  {
    prevSubject: true,
  },
  (subject, amount) => {
    cy.wrap(subject).click()
    if (RegExp('[0-9]{1,4}').test(amount)) {
      cy.wait(amount)
    } else if (amount === 'long') {
      cy.wait(2000)
    } else if (amount === 'medium') {
      cy.wait(1000)
    } else {
      cy.wait(500)
    }
  }
)
