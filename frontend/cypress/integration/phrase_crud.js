// const waitLong = 5000
const waitMedium = 2000
const waitShort = 50

// ===============================================
// clearPhraseForm
// ===============================================
function clearPhraseForm() {
  cy.logger({ type: 'subheader', text: 'clearPhraseForm' })

  cy.getByTestId('pageContainer').within(() => {
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
  cy.getByText('Phrase books')
    .parents('fieldset:first')
    .within(() => {
      cy.getByText('+ Add phrase book', { exact: false }).click()

      cy.getByText('create new phrase book', { exact: false }).click()
    })
  cy.getByTestId('PageDialectPhraseBooksCreate').within(() => {
    cy.getByText('Phrase book name', { exact: false })
      .parent()
      .find('input[type=text]')
      .type(name)
    cy.getByText('Phrase book description', { exact: false })
      .parent()
      .find('textarea')
      .type(description)
    cy.getByText('save', { exact: false }).click()
  })
}

// ===============================================
// populatePhraseForm
// ===============================================
function populatePhraseForm({ prefix, title, definition }) {
  // [POPULATE] Title
  cy.logger({ type: 'subheader', text: `${prefix} Title` })
  cy.getByText('Phrase')
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
  cy.getByText('Insert into entry').click()

  // [POPULATE] Related pictures
  cy.logger({ type: 'subheader', text: `${prefix} Related pictures` })
  cy.formPopulateRelatedPictures({
    name: `${prefix} Related pictures > Name`,
    description: `${prefix} Related pictures > Description`,
  })
  cy.wait(waitMedium)
  cy.getByText('Insert into entry').click()

  // [POPULATE] Related videos
  cy.logger({ type: 'subheader', text: `${prefix} Related videos` })
  cy.formPopulateRelatedVideos({
    name: `${prefix} Related videos > Name`,
    description: `${prefix} Related videos > Description`,
  })
  cy.wait(waitMedium)
  cy.getByText('Insert into entry').click()

  // [POPULATE] Cultural Note
  cy.logger({ type: 'subheader', text: `${prefix} Cultural Note` })
  cy.formPopulateCulturalNotes({ prefix })

  // [POPULATE] Reference
  cy.logger({ type: 'subheader', text: `${prefix} Reference` })
  cy.getByLabelText('Reference', { exact: false }).type(`${prefix} Reference`)

  // [POPULATE] Acknowledgement
  cy.logger({ type: 'subheader', text: `${prefix} Acknowledgement` })
  cy.getByLabelText('Acknowledgement', { exact: false }).type(`${prefix} Acknowledgement`)

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
  cy.getByTestId('Dialog__AddMediaComponentCancel').click()

  cy.formPopulateRelatedPictures({
    name: browseTitlePicture,
    description: `${timestamp} Related pictures > Description`,
  })
  cy.getByTestId('Dialog__AddMediaComponentCancel').click()

  cy.formPopulateRelatedVideos({
    name: browseTitleVideo,
    description: `${timestamp} Related videos > Description`,
  })
  cy.getByTestId('Dialog__AddMediaComponentCancel').click()

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
    cy.getByText('TestLanguageOne Phrases', { exact: false }).should('exist')
    cy.getByText('create new phrase', { exact: false }).click()
    cy.getByText('Add New Phrase to TestLanguageOne').should('exist')

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
    cy.getByLabelText("Available in children's archive", { exact: false }).check()

    // CREATE: save
    cy.logger({ type: 'subheader', text: `${prefix} Save` })
    cy.getByText('save', { exact: false }).click()

    cy.wait(waitMedium)

    // READ
    cy.logger({ type: 'header', text: 'READ' })
    cy.getByText(title).should('exist')
    cy.getByText(definition).should('exist')

    cy.getByTestId('DialectViewWordPhraseAudio').within(() => {
      cy.getByLabelText('Show Audio Information', { exact: false }).each(($el) => {
        cy.wrap($el).click()
      })
    })
    cy.getByTestId('DialectViewWordPhraseAudio').within(() => {
      cy.getByText(browseDescriptionAudio).should('exist')
    })
    cy.getByText(browseTitlePhrasebooks).should('exist')
    cy.getByText(browseTitlePicture).should('exist')
    cy.getByText(browseTitleVideo).should('exist')

    cy.getByText('metadata', { exact: false }).click()
    cy.getByText(browseTitleSource).should('exist')

    // UPDATE
    cy.logger({ type: 'header', text: 'UPDATE' })
    cy.getByText('Edit', { exact: false })
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
    cy.getByText('save', { exact: false }).click()

    cy.wait(3000)

    // UPDATE: verify
    cy.getByText(updateTitle).should('exist')
    cy.getByText(updateDefinition).should('exist')

    // DELETE
    cy.logger({ type: 'header', text: 'DELETE' })

    cy.getByText('delete phrase', { exact: false }).click()
    cy.wait(waitShort)

    // TODO: need more reliable hook
    cy.getByTestId('ViewWithActions__dialog').within(() => {
      cy.getByText('Delete').click()
    })
    cy.wait(waitShort)
    cy.getByText('Delete phrase success', { exact: false }).should('exist')
  })
})
