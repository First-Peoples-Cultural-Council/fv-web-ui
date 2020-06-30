// const waitLong = 5000
const waitMedium = 2000
const waitShort = 50

// ===============================================
// clearPhraseForm
// ===============================================
function clearPhraseForm() {
  cy.logger({ type: 'subheader', text: 'clearPhraseForm' })

  cy.findByTestId('pageContainer').within(() => {
    // Clear input texts
    cy.get('input[name="dc:title"]').clear()
    cy.get('input[name="fv:reference"]').clear()
    cy.get('input[name="fv-phrase:acknowledgement"]').clear()

    // Remove x's
    cy.formClickAllXs()
  })
}
// ===============================================
// populatePhraseBooks
// ===============================================
function populatePhraseBooks({ name, description }) {
  cy.findByText('Phrase books')
    .parents('fieldset:first')
    .within(() => {
      cy.findByText('+ Add phrase book', { exact: false }).click()

      cy.findByText('create new phrase book', { exact: false }).click()
    })
  cy.findByTestId('PageDialectPhraseBooksCreate').within(() => {
    cy.findByText('Phrase book name', { exact: false })
      .parent()
      .find('input[type=text]')
      .type(name)
    cy.findByText('Phrase book description', { exact: false })
      .parent()
      .find('textarea')
      .type(description)
    cy.findByText('save', { exact: false }).click()
  })
}

// ===============================================
// populatePhraseForm
// ===============================================
function populatePhraseForm({ prefix, title, definition }) {
  // [POPULATE] Title
  cy.logger({ type: 'subheader', text: `${prefix} Title` })
  cy.findByText('Phrase')
    .parent()
    .find('input[type=text]')
    .type(title)

  // [POPULATE] Definition
  cy.logger({ type: 'subheader', text: `${prefix} Definition` })
  cy.formPopulateDefinitions({ definition })

  // [POPULATE] Phrase Book
  cy.logger({ type: 'subheader', text: `${prefix} Phrase Book` })
  populatePhraseBooks({ name: `${prefix} Phrase book name`, description: `${prefix} Phrase book description` })

  // [POPULATE] Related Audio
  cy.logger({ type: 'subheader', text: `${prefix} Related Audio` })
  cy.formPopulateRelatedAudio({
    name: `${prefix} AUDIO > NAME`,
    description: `${prefix} AUDIO > DESCRIPTION`,
  })
  cy.wait(waitMedium)
  cy.findByText('Insert into entry').click()

  // [POPULATE] Related pictures
  cy.logger({ type: 'subheader', text: `${prefix} Related pictures` })
  cy.formPopulateRelatedPictures({
    name: `${prefix} Related pictures > Name`,
    description: `${prefix} Related pictures > Description`,
  })
  cy.wait(waitMedium)
  cy.findByText('Insert into entry').click()

  // [POPULATE] Related videos
  cy.logger({ type: 'subheader', text: `${prefix} Related videos` })
  cy.formPopulateRelatedVideos({
    name: `${prefix} Related videos > Name`,
    description: `${prefix} Related videos > Description`,
  })
  cy.wait(waitMedium)
  cy.findByText('Insert into entry').click()

  // [POPULATE] Cultural Note
  cy.logger({ type: 'subheader', text: `${prefix} Cultural Note` })
  cy.formPopulateCulturalNotes({ prefix })

  // [POPULATE] Reference
  cy.logger({ type: 'subheader', text: `${prefix} Reference` })
  cy.findByLabelText('Reference', { exact: false }).type(`${prefix} Reference`)

  // [POPULATE] Acknowledgement
  cy.logger({ type: 'subheader', text: `${prefix} Acknowledgement` })
  cy.findByLabelText('Acknowledgement', { exact: false }).type(`${prefix} Acknowledgement`)

  // [POPULATE] Source
  cy.logger({ type: 'subheader', text: `${prefix} Source` })
  cy.formPopulateSource({ name: `${prefix} New Contributor > Contributor Name` })
}
// ===============================================
// populatePhraseFormBrowse
// ===============================================
function populatePhraseFormBrowse({
  browseTitlePhrasebooks,
  browseTitleAudio,
  browseDescriptionAudio,
  browseTitlePicture,
  browseTitleVideo,
  browseTitleSource,
  timestamp,
}) {
  // BROWSE CREATING
  // ------------------------------------------
  populatePhraseBooks({ name: browseTitlePhrasebooks, description: `${timestamp} Phrase book description` })

  cy.formPopulateRelatedAudio({
    name: browseTitleAudio,
    description: browseDescriptionAudio,
  })
  cy.findByTestId('Dialog__AddMediaComponentCancel').click()

  cy.formPopulateRelatedPictures({
    name: browseTitlePicture,
    description: `${timestamp} Related pictures > Description`,
  })
  cy.findByTestId('Dialog__AddMediaComponentCancel').click()

  cy.formPopulateRelatedVideos({
    name: browseTitleVideo,
    description: `${timestamp} Related videos > Description`,
  })
  cy.findByTestId('Dialog__AddMediaComponentCancel').click()

  cy.formPopulateSource({ name: browseTitleSource })

  // BROWSE CLEARING
  // ------------------------------------------
  cy.logger({ type: 'subheader', text: 'CREATE > BROWSE: clearing form' })
  clearPhraseForm()

  // BROWSE SELECTING
  // ------------------------------------------
  cy.logger({ type: 'subheader', text: 'CREATE > BROWSE: selecting browse data' })

  // BROWSE: phrase books
  cy.formBrowseTableSelectItem({
    sectionTitle: 'Phrase books',
    addButtonText: '+ Add phrase book',
    browseButtonText: 'browse existing',
    itemTitle: timestamp,
  })

  // BROWSE > AUDIO
  cy.formBrowseMediaSelectItem({
    sectionTitle: 'Related audio',
    sectionTitleExact: true,
    addButtonText: '+ Add Related Audio',
    browseButtonText: 'browse audio',
    mediaTitle: timestamp,
  })

  // BROWSE > PICTURES
  cy.formBrowseMediaSelectItem({
    sectionTitle: 'Related pictures',
    addButtonText: '+ Add Related pictures',
    browseButtonText: 'browse pictures',
    mediaTitle: timestamp,
  })

  // BROWSE > VIDEOS
  cy.formBrowseMediaSelectItem({
    sectionTitle: 'Related videos',
    addButtonText: '+ Add Related videos',
    browseButtonText: 'browse videos',
    mediaTitle: timestamp,
  })

  // BROWSE > SOURCE
  cy.formBrowseTableSelectItem({
    sectionTitle: 'Source',
    addButtonText: '+ Add source',
    browseButtonText: 'browse contributors',
    itemTitle: timestamp,
  })
}
// ===============================================
// phrase_crud
// ===============================================
describe('phrase_crud.js > PageDialectPhrasesCreate', () => {
  it('CRUD', () => {
    // Note: need to set environment variables in your bash_profile, eg:
    // export ADMIN_USERNAME='THE_USERNAME'
    // export ADMIN_PASSWORD='THE_PASSWORD'

    // Login
    cy.login({
      userName: 'TESTLANGUAGEONE_ADMIN',
    })

    const prefix = '[CREATE]'
    const title = `${prefix} Phrase`
    const definition = `${prefix} Definition`

    const updatePrefix = '[UPDATE]'
    const updateTitle = `${updatePrefix} Phrase`
    const updateDefinition = `${updatePrefix} Definition`

    const timestamp = `${Date.now()}`
    const browseTitlePhrasebooks = `${timestamp} PHRASEBOOK > NAME`
    const browseTitleAudio = `${timestamp} AUDIO > NAME`
    const browseDescriptionAudio = `${timestamp} AUDIO > DESCRIPTION`
    const browseTitlePicture = `${timestamp} PICTURE > NAME`
    const browseTitleVideo = `${timestamp} VIDEO > NAME`
    const browseTitleSource = `${timestamp} SOURCE > NAME`

    cy.visit('/explore/FV/Workspaces/Data/Test/Test/TestLanguageOne/learn/phrases')
    // cy.wait(500)
    cy.findByText('TestLanguageOne Phrases', { exact: false }).should('exist')
    cy.findByText('create new phrase', { exact: false }).click()
    cy.findByText('Add New Phrase to TestLanguageOne').should('exist')

    // Browse
    cy.logger({ type: 'header', text: 'CREATE > BROWSE' })
    populatePhraseFormBrowse({
      browseTitlePhrasebooks,
      browseTitleAudio,
      browseDescriptionAudio,
      browseTitlePicture,
      browseTitleVideo,
      browseTitleSource,
      timestamp,
    })

    // Create
    cy.logger({ type: 'header', text: 'CREATE' })

    populatePhraseForm({
      prefix,
      title,
      definition,
    })

    // CREATE > children's archive
    cy.logger({ type: 'subheader', text: `${prefix} Children's archive` })
    cy.findByLabelText("Available in children's archive", { exact: false }).check()

    // CREATE: save
    cy.logger({ type: 'subheader', text: `${prefix} Save` })
    cy.findByText('save', { exact: false }).click()

    cy.wait(waitMedium)

    // READ
    cy.logger({ type: 'header', text: 'READ' })
    cy.findByText(title).should('exist')
    cy.findByText(definition).should('exist')

    cy.findByTestId('DialectViewWordPhraseAudio').within(() => {
      cy.findByLabelText('Show Audio Information', { exact: false }).each(($el) => {
        cy.wrap($el).click()
      })
    })
    cy.findByTestId('DialectViewWordPhraseAudio').within(() => {
      cy.findByText(browseDescriptionAudio).should('exist')
    })
    cy.findByText(browseTitlePhrasebooks).should('exist')
    cy.findByText(browseTitlePicture).should('exist')
    cy.findByText(browseTitleVideo).should('exist')

    cy.findByText('metadata', { exact: false }).click()
    cy.findByText(browseTitleSource).should('exist')

    // UPDATE
    cy.logger({ type: 'header', text: 'UPDATE' })
    cy.findByText('Edit', { exact: false })
      .parents('button:first')
      .click()
    cy.wait(waitShort)

    clearPhraseForm()

    populatePhraseForm({
      prefix: updatePrefix,
      title: updateTitle,
      definition: updateDefinition,
    })

    // UPDATE: save
    cy.findByText('save', { exact: false }).click()

    cy.wait(3000)

    // UPDATE: verify
    cy.findByText(updateTitle).should('exist')
    cy.findByText(updateDefinition).should('exist')

    // DELETE
    cy.logger({ type: 'header', text: 'DELETE' })

    cy.findByText('delete phrase', { exact: false }).click()
    cy.wait(waitShort)

    // TODO: need more reliable hook
    cy.findByTestId('ViewWithActions__dialog').within(() => {
      cy.findByText('Delete').click()
    })
    cy.wait(waitShort)
    cy.findByText('Delete phrase success', { exact: false }).should('exist')
  })
})
